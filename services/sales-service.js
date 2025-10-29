const Sales = require("../models/Sales");
const { buildFilter } = require("../utils/filter-builder");

async function getSalesList({
  companyId,
  page = 1,
  limit = 10,
  order = "asc",
  orderBy = "name",
  search = "",
  type = "",
}) {
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  let baseFilter = { companyId };
  if (type != "") {
    baseFilter = { ...baseFilter, type };
  }

  const filter = buildFilter({
    search,
    fields: ["name"],
    baseFilter,
  });

  console.log("fillll", filter);

  const sales = await Sales.find(filter, {
    name: 1,
    client_name: 1,
    clientId: 1,
    order_no: 1,
    grand_total: 1,
    products: 1,
    type: 1,
  })
    .sort({ [orderBy]: order === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Sales.countDocuments(filter);

  return {
    data: sales,
    total,
  };
}

module.exports = { getSalesList };
