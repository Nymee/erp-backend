const Sales = require("'../models/Sales");
const validateSales = require("../services/sales-validation.service");

const createSales = async (req, res, next) => {
  try {
    const salesInfo = req.body;
    const salesProducts = req.body.products;
    const value = validateSales(salesProducts);
  } catch (err) {
    next(err);
  }
};

const updateSales = async(req, res, next)=>{
  try{
    const salesInfo = req.body;
    const salesProducts = req.body.products;
    const value = validateSales(salesProducts);

    if(value){
      
    }


  }
}
