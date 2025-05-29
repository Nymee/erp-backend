const Product = require("../models/Product");
const validateProduct = require("./product-validation.service");
const Sales = require("../models/Sales");
const { diffProducts } = require("./sales-product-diffing.service");

async function updateSalesWorkflow(body, sales_id) {
  const salesInfo = body;
  const salesId = sales_id;
  const salesProducts = salesInfo.products;
  const price_update = salesInfo.price_update;
  const so_discount = salesInfo.so_discount;
  const so_discount_type = salesInfo.so_discount_type;
  let so_discount_amount = 0;
  let grand_total_before_so_discount = 0;
  let grand_total = 0;

  const estimation = await Sales.findById(salesId);
  const estimationInfo = await estimation.lean();
  if (!estimationInfo) {
    throw new Error("Estimation not found.");
  }
  const estProds = estimationInfo.products;
  const { added: newProducts, updated } = diffProducts(estProds, salesProducts);
  const existingProducts = updated?.map((u) => u.to) || [];

  if (price_update) {
    let existingValidated = existingProducts.length
      ? await validateWithProductData(existingProducts)
      : [];
  } else {
    let existingValidated = existingProducts.length
      ? await validateWithSalesData(existingProducts, estProds)
      : [];
  }

  let newValidated = newProducts.length
    ? await validateWithProductData(newProducts)
    : [];

  let productList = [...existingValidated, ...newValidated];

  if (productList.length) {
    grand_total_before_so_discount = grandTotalBeforeSoDiscount(productList);
    if (so_discount) {
      so_discount_amount = calculateSODiscountAmount(
        so_discount,
        so_discount_type,
        grand_total_before_so_discount
      );

      grand_total = grand_total_before_so_discount - so_discount_amount;
    }
  }
  Object.assign(estimation, {
    products: productList,
    so_discount_amount: so_discount_amount,
    grand_total_before_so_discount: grand_total_before_so_discount,
    grand_total: grand_total,
  });

  return estimation;
}

async function validateWithProductData(salesProducts) {
  //you redeclared salesProducts
  const salesProductIds = salesProducts.map((p) => p.product_id);
  const originalProducts = await Product.find({
    _id: { $in: salesProductIds }, //comparison by value not by reference
  }).lean(); //you forgot await

  let validatedProductsArray = [];

  if (originalProducts && originalProducts.length > 0) {
    //you forgot to check length
    const salesProductsMap = new Map();
    for (const product of salesProducts) {
      // you wrote in instead of of
      salesProductsMap.set(product.product_id.toString(), product);
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
        };

        const prodToValidate = {
          ...originalProdDetails,
          ...currentSalesProd,
        };

        try {
          const result = validateProduct(prodToValidate, "sales");
          if (result) {
            validatedProductsArray.push(result);
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
  const estProdMap = new Map(estProds.map((p) => [String(p.product_id), p]));

  for (const product of salesProducts) {
    const current = estProdMap.get(String(product.product_id));
    if (!current) continue;

    const estProdDetails = {
      min_margin: current.min_margin,
      max_margin: current.max_margin,
      margin_unit: current.margin_unit,
      gst: current.gst,
      cess: current.cess,
    };

    const prodToValidate = {
      ...product,
      ...estProdDetails,
    };

    try {
      const result = validateProduct(prodToValidate, "sales");
      if (result) {
        validatedProductsArray.push(result);
      }
    } catch (err) {
      throw new Error(
        `Validation failed for product ${product.product_id}: ${err.message}`
      );
    }
  }

  return validatedProductsArray;
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

module.exports = {
  validateWithProductData,
  validateWithSalesData,
  grandTotalBeforeSoDiscount,
  calculateSODiscountAmount,
};
