const InventoryProduct = require("../models/InventoryProduct");
const { buildFilter } = require("../utils/filter-builder");

async function getInventoryProductList({
  companyId,
  page = 1,
  limit = 10,
  order = "asc",
  orderBy = "updated_date",
  search = "",
}) {
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const filter = buildFilter({
    search,
    fields: ["product_name", "supplier_name"],
    baseFilter: { companyId },
  });

  //Run query and count in parallel
  const [inventoryProducts, total] = await Promise.all([
    InventoryProduct.find(filter, {
      product_name: 1,
      supplier_name: 1,
      quantity: 1,
      updated_date: 1,
    })
      .sort({ [orderBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    InventoryProduct.countDocuments(filter),
  ]);

  return {
    data: inventoryProducts,
    total,
  };
}

module.exports = { getInventoryProductList };
