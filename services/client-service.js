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
    clients = await Client.find({}, { name: 1 });
    const total = await Client.countDocuments({});

    return {
      data: clients,
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

    //Run query and count in parallel (was sequential)
    const [clients, total] = await Promise.all([
      Client.find(filter, {
        name: 1,
        email: 1,
        phone: 1,
      })
        .sort({ [orderBy]: order === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Client.countDocuments(filter),
    ]);

    return {
      data: clients,
      total,
    };
  }
}

module.exports = { getClientList };
