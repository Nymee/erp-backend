const Product = require("../models/Product");
const validateProduct = require("./product-validation.service");

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

function validateWithSalesData(salesProducts) {}

module.exports = validateSales;
