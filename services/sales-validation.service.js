const Product = require("../models/Product");
const validateProduct = require("./product-validation.service");
const Sales = require("../models/Sales");

async function validateWithProductData(salesProducts) {
  //you redeclared salesProducts
  const salesProductIds = salesProducts.map((p) => p.product_id);
  const originalProducts = await Product.find({
    _id: { $in: salesProductIds }, //comparison by value not by reference
  }).lean(); //you forgot await

  let validatedProductArray = [];

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
            validatedProductArray.push(result);
          }
        } catch (err) {
          throw new Error(
            `Validation failed for product ${original._id}: ${err.message}`
          );
        }
      }
      calculateTotalSalesPrice(validateProductArray);
      calculateGrandTotal(validatedProductArray);
    }
  }

  function calculateTotalSalesPrice() {}

  function calculateGrandTotal(array) {
    let grandTotal = 0;
  }
  return validatedProductArray;
}

async function validateWithSalesData(salesProducts, salesId) {
  const estimationInfo = await Sales.findById(salesId).lean();
  if (!estimationInfo) {
    throw new Error("Estimation not found.");
  }
  const estProds = estimationInfo.products;
  const estProdMap = new Map();
  let validatedProductArray = [];

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
        validatedProductArray.push(result);
      }
    } catch (err) {
      throw new Error(
        `Validation failed for product ${product.product_id}: ${err.message}`
      );
    }
  }
}

module.exports = { validateWithProductData, validateWithSalesData };
