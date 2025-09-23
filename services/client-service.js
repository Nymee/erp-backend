const Client = require("../models/Client");
const { buildFilter } = require("../utils/filter-builder");

async function getClientList({
  companyId,
  page = 1,
  limit = 10,
  order = "asc",
  orderBy = "name",
  search = "",
  dropdown = false,
}) {
  let clients = [];
  let filter = {};

  if (dropdown) {
    const clients = await Client.find({}, { name: 1 });
  } else {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    filter = buildFilter({
      search,
      fields: ["name", "email"], // or whichever fields you allow searching
      baseFilter: { companyId },
    });

    clients = await Client.find(filter, {
      name: 1,
      email: 1,
      phone: 1,
    })
      .sort({ [orderBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  const total = await Client.countDocuments(filter);

  return {
    data: clients,
    total,
  };
}

module.exports = { getClientList };
