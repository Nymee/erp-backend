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
  const so_discount_amount = 0;
  let grand_total_before_so_discount = 0;
  let grand_total = 0;
  let existingProductsResult = [];

  const estimationInfo = await Sales.findById(salesId).lean();
  if (!estimationInfo) {
    throw new Error("Estimation not found.");
  }
  const estProds = estimationInfo.products;
  const { added: newProducts, updated } = diffProducts(estProds, salesProducts);
  const existingProducts = updated?.map((u) => u.to) || [];

  if (price_update) {
    existingProductsResult = existingProducts.length
      ? await validateWithProductData(existingProducts)
      : [];
  } else {
    existingProductsResult = existingProducts.length
      ? await validateWithSalesData(existingProducts)
      : [];
  }

  let newProductsResult = newProducts
    ? await validateWithProductData(salesProducts)
    : [];

  let productList = [...existingProductsResult, ...newProductsResult];

  if (productList.length) {
    grand_total_before_so_discount = calculateGrandTotal(productList);
    if (so_discount) {
      so_discount_amount = calculateSODiscountAmount(
        so_discount,
        so_discount_type,
        grand_total_before_so_discount
      );

      grand_total = grand_total_before_so_discount - so_discount_amount;
    }

    if (price_update) result = await validateWithProductData(existingProducts);
    else result = await validateWithSalesData(salesProducts, estProds);
  }
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
      salesProductsMap.set(String(product.product_id), product);
    }

    for (const original of originalProducts) {
      let currentSalesProd = salesProductsMap.get(String(original._id)); // get uses strict equality ===.reference of objectids wont be same unless we convert to string. since string is primitive no reference and hence only value matters in ===.
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
  const estProdMap = new Map();
  let validatedProductsArray = [];

  for (const prod of estProds) {
    estProdMap.set(String(prod.product_id), prod);
  }

  for (const product of salesProducts) {
    const currentEstProd = estProdMap.get(String(product.product_id));
    const currentEstProdDetails = {
      min_margin: currentEstProd.min_margin,
      max_margin: currentEstProd.max_margin,
      margin_unit: currentEstProd.margin_unit,
      gst: currentEstProd.gst,
      cess: currentEstProd.cess,
    };
    const prodToValidate = {
      ...product,
      ...currentEstProdDetails,
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

function calculateGrandTotal(productsArray) {
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
    so_discount_amount =
      grand_total_before - (grand_total_before * so_discount) / 100;
  } else if (so_discount_type === "rup") {
    so_discount_amount = grand_total_before - so_discount;
  } else throw new Error("Invalid SO Discount Type");
}

module.exports = {
  validateWithProductData,
  validateWithSalesData,
  calculateGrandTotal,
  calculateSODiscountAmount,
};
