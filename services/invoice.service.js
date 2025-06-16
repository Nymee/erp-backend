const mongoose = require("mongoose");
const Sales = require("../models/Sales");

async function createInvoiceFlow(reqBody) {
  let invoiceArray = [];
  let invoiceproductsArray = [];
  let totalAmount = 0;
  const salesId = reqBody.sales_id;
  const clientId = reqBody.client_id;
  const salesOrder = await Sales.findById(salesId);

  if (!salesOrder) throw new Error("Sales order not found");

  const orderInfo = await salesOrder.product.lean();

  const orderMap = new Map(orderInfo.map((p) => [p.product_id.toString(), p]));

  const dispatchProducts = reqBody.products;

  for (const product in dispatchProducts) {
    const pId = product.product_id;
    qty = product.quantity;

    //update in sales table
    const index = orderInfo.findIndex((p) => p.product_id === pId);

    if (index == -1) {
      throw new Error(`Product ID ${pId} not found in sales order`);
    } else {
      orderProd = orderInfo[index];
    }
    if (orderProd.fully_dispatched === true) {
      throw new Error(`Product ID ${pId} already fullt dispatched`);
    } else {
      orderProd.dispatched_quantity = +qty;
    }

    //update in invoice table
    totalAmount = +orderProd.single_product_amount * qty;

    invoiceproductsArray.push(product);
  }

  return {
    salesId,
    clientId,
    total_amount: totalAmount,
    paid_amount: 0,
    products: invoiceproductsArray,
    status: "unpaid",
  };
}
