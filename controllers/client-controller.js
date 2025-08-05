const Client = require("../models/Client");
const getClients = async (req, res, next) => {
  try {
    const companyId = req.token.company_id;


    if (!companyId) {
      return new Error();
    }

    const users = await Client.find({ companyId });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.client_id);
    if (!client) {
      const error = new Error("No such client");
      error.status = 404;
      throw error;
    }
    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const { client_id } = req.params;
    const client = await Client.findById(client_id);

    if (!client) {
      const error = new Error("No such client");
      error.status = 404;
      throw error;
    }

    Object.assign(client, req.body);
    await client.save();
    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    console.log(req.body)
    const client = new Client({...req.body, companyId: req.token.company_id, branchId: req.token.branch_id});
    console.log("Creating client with data:", client);
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients,
  getClientById,
  updateClient,
  createClient,
};
