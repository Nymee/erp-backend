module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({
        message: error.details[0].message,
        field: error.details[0].path[0],
        type: error.details[0].type,
      });
    }
    next();
  };
};
