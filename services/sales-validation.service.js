const Product = require("../models/Product");
const validateProduct = require("./product-validation.service");

async function validateSales(salesProducts) {
  //you redeclared salesProducts
  const salesProductIds = salesProducts.map((p) => p.product_id);
  const originalProducts = await Product.find({
    _id: { $in: salesProductIds }, //comparison by value not by reference
  }); //you forgot await
  let validatedProductArray = [];

  if (originalProducts && originalProducts.length > 0) {
    //you forgot to check length
    const salesProductsMap = new Map();
    for (const product of salesProducts) {
      // you wrote in instead of of
      salesProductsMap.set(String(product.product_id), product);
    }

    for (const original of originalProducts) {
      let currentProd = salesProductsMap.get(String(original._id)); // get uses strict equality ===.reference of objectids wont be same unless we convert to string. since string is primitive no reference and only value matter in ===.
      if (currentProd) {
        const prodToValidate = {
          ...original.toObject(),
          ...currentProd,
        };
        try {
          const result = validateProduct(prodToValidate, "sales");
        } catch (err) {
          throw new Error(
            `Validation failed for product ${original._id}: ${err.message}`
          );
        }
        if (result) {
          validatedProductArray.push(result);
        }
      }
    }
  }
  return validatedProductArray;
}

module.exports = validateSales;
