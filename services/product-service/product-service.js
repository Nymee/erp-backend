const Product = require("../../models/Product");
const { buildFilter } = require("../../utils/filter-builder");

 
 
 
 
 async function getProductList ({ companyId, page = 1, limit = 10, order = "asc", orderBy = "name", search = "" }){
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const filter = buildFilter({
    search,
    fields: ["name"],
    baseFilter: { companyId },
  });

  const products = await Product.find(filter, {
    name: 1,
    cost_price: 1,
    retail_margin: 1,
    discount_price: 1,
    gst: 1,
    cess: 1,
    sales_price: 1,
  })
    .sort({ [orderBy]: order === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  return {
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};



module.exports = {getProductList};