const Supplier = require("../models/Supplier");
const { buildFilter } = require("../utils/filter-builder");

async function getSupplierList({
  companyId,
  page = 1,
  limit = 10,
  order = "asc",
  orderBy = "name",
  search = "",
  dropdown = false,
}) {
  let suppliers = [];
  let filter = {};

  if (dropdown) {
    suppliers = await Supplier.find({}, { name: 1 });
    const total = await Supplier.countDocuments({});

    return {
      data: suppliers,
      total,
    };
  } else {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    filter = buildFilter({
      search,
      fields: ["name", "email"],
      baseFilter: { companyId },
    });

    const [suppliers, total] = await Promise.all([
      Supplier.find(filter, {
        name: 1,
        email_id: 1,
        mobile: 1,
        address: 1,
      })
        .sort({ [orderBy]: order === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Supplier.countDocuments(filter),
    ]);

    return {
      data: suppliers,
      total,
    };
  }
}

module.exports = { getSupplierList };
