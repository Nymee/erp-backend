const Joi =  require ("joi");


const createSupplierSchema = Joi.object({
    name: Joi.string().required(),
    email_id: Joi.string().email().required(),
    mobile: Joi.string().required(),
    address: Joi.string()
})

const updateSupplierSchema = Joi.object({
    name: Joi.string(),
    email_id: Joi.string().email(),
    mobile: Joi.string(),
    address: Joi.string(),
    companyId: Joi.string(),
    branchId: Joi.string()
}).min(1);

module.exports = {
    createSupplierSchema,
    updateSupplierSchema
}
