const Product = require("../models/Product");


function validateSales(salesProducts){
    const salesProductIds = salesProducts.map(p=>p.product_id)
    const originalProducts = Product.find({_id: {$in: salesProductIds}})

    for 


}

module.exports = validateSales;
