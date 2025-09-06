 function buildFilter({ search = "", fields = [], baseFilter = {} }) {
  let filter = { ...baseFilter };

  if (search && fields.length > 0) {
    filter.$or = fields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  return filter;
}

module.exports = { buildFilter };
