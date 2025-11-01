const Product = require("../models/Product");
const validateProduct = require("./product-validation.service");
const Sales = require("../models/Sales");
const { diffProducts } = require("./sales-product-diffing.service");
const InventoryProduct = require("../models/InventoryProduct");

async function createSalesWorkFlow(body) {
  const salesProducts = body.products;
  const valid = checkInventoryStock(salesProducts);
  const so_discount = body.so_discount;
  const so_discount_type = body.so_discount_type;

  let soResult = {
    so_discount_amount: 0,
    grand_total_before_so_discount: 0,
    grand_total: 0,
  };

  let productList = await validateWithProductData(salesProducts);
  if (!productList.length) {
    throw new Error("No valid products found in sales request.");
  }

  if (productList.length) {
    soResult = applySODiscount(productList, so_discount, so_discount_type);
  }

  const data = {
    ...body,
    products: productList,
    ...soResult,
  };

  return data;
}

async function updateSalesWorkflow(body, sales_id) {
  const salesInfo = body;
  const salesId = sales_id;
  const salesProducts = salesInfo.products;
  const type = salesInfo.type;
  const so_discount = salesInfo.so_discount;
  const so_discount_type = salesInfo.so_discount_type;
  let soResult = {
    so_discount_amount: 0,
    grand_total_before_so_discount: 0,
    grand_total: 0,
  };

  const estimation = await Sales.findById(salesId);
  const estimationInfo = await Sales.findById(salesId).lean();

  if (!estimationInfo) {
    throw new Error("Estimation not found.");
  }
  if (estimationInfo.type === "order") {
    const error = new Error("Order can't be edited");
    error.status = 400;
    throw error;
  }
  const estProds = estimationInfo.products;
  const { newOrRefreshed, updated: existingProducts } = diffProducts(
    estProds,
    salesProducts
  );

  const { expired, expiredProducts } = checkExpiry(existingProducts);
  if (expired) {
    const error = new Error(
      `The following products have expired and must be refreshed: ${expiredProducts
        .map((p) => p.productId)
        .join(", ")}`
    );
    error.status = 400;
    throw error;
  }
  const existingValidated = existingProducts.length
    ? await validateWithSalesData(existingProducts, estProds)
    : [];

  const newOrRefreshedValidated = newOrRefreshed.length
    ? await validateWithProductData(newOrRefreshed)
    : [];

  const productList = [...existingValidated, ...newOrRefreshedValidated];

  if (productList.length) {
    soResult = applySODiscount(productList, so_discount, so_discount_type);
  }
  Object.assign(estimation, {
    products: productList,
    so_discount_amount: soResult.so_discount_amount,
    grand_total_before_so_discount: soResult.grand_total_before_so_discount,
    grand_total: soResult.grand_total,
    type: type,
  });

  return estimation;
}

async function validateWithProductData(salesProducts) {
  //you redeclared salesProducts
  const salesProductIds = salesProducts.map((p) => p.productId);

  const originalProducts = await Product.find({
    _id: { $in: salesProductIds }, //comparison by value not by reference
  }).lean(); //you forgot await

  let validatedProductsArray = [];
  const last_refresh = Math.floor(Date.now() / 1000);
  const expiry = last_refresh + 7 * 24 * 60 * 60;

  if (originalProducts && originalProducts.length > 0) {
    //you forgot to check length
    const salesProductsMap = new Map();
    for (const product of salesProducts) {
      // you wrote in instead of of
      salesProductsMap.set(product.productId.toString(), product);
    }

    for (const original of originalProducts) {
      let currentSalesProd = salesProductsMap.get(original._id.toString()); // get uses strict equality ===.reference of objectids wont be same unless we convert to string. since string is primitive no reference and hence only value matters in ===.
      if (currentSalesProd) {
        const originalProdDetails = {
          min_margin: original.min_margin,
          max_margin: original.max_margin,
          margin_unit: original.margin_unit,
          gst: original.gst,
          cess: original.cess,
          cost_price: original.cost_price,
        };

        const prodToValidate = {
          ...originalProdDetails,
          ...currentSalesProd,
        };

        try {
          const result = validateProduct(prodToValidate, "sales");
          if (result) {
            const finalResult = { ...result, last_refresh, expiry };
            validatedProductsArray.push(finalResult);
          }
        } catch (err) {
          throw new Error(
            `Validation failed for product ${original._id}: ${err.message}`
          );
        }
      }
    }
  }
  return validatedProductsArray;
}

async function validateWithSalesData(salesProducts, estProds) {
  let validatedProductsArray = [];
  const estProdMap = new Map(estProds.map((p) => [String(p.productId), p]));

  for (const product of salesProducts) {
    const current = estProdMap.get(String(product.productId));
    if (!current) continue;

    const last_refresh = current.last_refresh;
    const expiry = current.expiry;
    const estProdDetails = {
      min_margin: current.min_margin,
      max_margin: current.max_margin,
      gst: current.gst,
      cess: current.cess,
      cost_price: current.cost_price,
    };

    const prodToValidate = {
      ...estProdDetails,
      ...product,
    };

    try {
      const result = validateProduct(prodToValidate, "sales");
      if (result) {
        const finalResult = { ...result, last_refresh, expiry };
        validatedProductsArray.push(finalResult);
      }
    } catch (err) {
      throw new Error(
        `Validation failed for product ${product.productId}: ${err.message}`
      );
    }
  }

  return validatedProductsArray;
}

function applySODiscount(products, so_discount, so_discount_type) {
  const grand_total_before_so_discount = grandTotalBeforeSoDiscount(products);
  let so_discount_amount = 0;
  let grand_total = grand_total_before_so_discount;

  if (so_discount) {
    so_discount_amount = calculateSODiscountAmount(
      so_discount,
      so_discount_type,
      grand_total_before_so_discount
    );
    grand_total = grand_total_before_so_discount - so_discount_amount;
  }

  return {
    grand_total_before_so_discount,
    so_discount_amount,
    grand_total,
  };
}

function grandTotalBeforeSoDiscount(productsArray) {
  let grand_total_before_so_discount = productsArray.reduce((sum, product) => {
    return sum + (product.total_sales_price || 0);
  }, 0);

  return grand_total_before_so_discount;
}

function calculateSODiscountAmount(
  so_discount,
  so_discount_type,
  grand_total_before
) {
  let so_discount_amount;
  if (so_discount_type === "per") {
    so_discount_amount = (grand_total_before * so_discount) / 100;
  } else if (so_discount_type === "rup") {
    so_discount_amount = so_discount;
  } else {
    throw new Error("Invalid SO Discount Type");
  }
  return so_discount_amount;
}

function checkExpiry(products) {
  const now = Math.floor(Date.now() / 1000);
  let expiredProducts = [];
  products.forEach((prod) => {
    if (prod.expiry <= now) {
      expiredProducts.push(prod);
    }
  });

  if (expiredProducts && expiredProducts.length > 0) {
    return {
      expired: true,
      expiredProducts,
    };
  } else
    return {
      expired: false,
      expiredProducts,
    };
}


async function checkInventoryStock(salesProducts) {
  // Extract product IDs from sales products
  const productIds = salesProducts.map((p) => p.productId);

  // Fetch inventory products for these product IDs
  const inventoryProducts = await InventoryProduct.find({
    productId: { $in: productIds },
  }).lean();

  // Create a map of productId to available quantity
  const inventoryMap = new Map();
  inventoryProducts.forEach((inv) => {
    inventoryMap.set(inv.productId.toString(), inv.quantity);
  });

  // Check for out of stock products
  const outOfStockProducts = [];

  for (const salesProduct of salesProducts) {
    const productId = salesProduct.productId.toString();
    const requestedQuantity = salesProduct.quantity || 0;
    const availableQuantity = inventoryMap.get(productId) || 0;

    if (availableQuantity < requestedQuantity) {
      // Fetch product name for better error message
      const product = await Product.findById(productId).lean();
      outOfStockProducts.push({
        productId: productId,
        productName: product ? product.name : productId,
        requested: requestedQuantity,
        available: availableQuantity,
        shortage: requestedQuantity - availableQuantity,
      });
    }
  }

  // If there are out of stock products, throw an error
  if (outOfStockProducts.length > 0) {
    const errorMessages = outOfStockProducts.map(
      (p) =>
        `${p.productName} (requested: ${p.requested}, available: ${p.available}, short by: ${p.shortage})`
    );

    const error = new Error(
      `The following products are out of stock and cannot be ordered: ${errorMessages.join(
        ", "
      )}`
    );
    error.status = 400;
    error.outOfStockProducts = outOfStockProducts;
    throw error;
  }

  return { success: true };
}

module.exports = {
  validateWithProductData,
  validateWithSalesData,
  grandTotalBeforeSoDiscount,
  calculateSODiscountAmount,
  createSalesWorkFlow,
  updateSalesWorkflow,
  checkInventoryStock
};
