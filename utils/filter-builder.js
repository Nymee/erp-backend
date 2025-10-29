function buildFilter({ search = "", fields = [], baseFilter = {} }) {
  let filter = { ...baseFilter };

  if (search && fields.length > 0) {
    filter.$or = fields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  console.log(filter);

  return filter;
}

module.exports = { buildFilter };
