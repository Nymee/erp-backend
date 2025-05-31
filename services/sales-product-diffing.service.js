function diffProducts(existingProducts, incomingProducts) {
  const existingMap = new Map();
  const newOrRefreshed = [];
  const removed = [];
  const updated = [];

  // Index existing products by product_id
  for (const product of existingProducts) {
    existingMap.set(product.product_id.toString(), product);
  }

  // Compare incoming with existing
  for (const incoming of incomingProducts) {
    const id = incoming.product_id.toString();
    const existing = existingMap.get(id);

    if (!existing) {
      newOrRefreshed.push(incoming);
    } else {
      const isRefreshed = incoming.price_update == true;
      if (isRefreshed) {
        newOrRefreshed.push(incoming);
      } else {
        updated.push(incoming);
      }
    }
    existingMap.delete(id); // Mark as processed
  }

  // Anything still in existingMap was removed
  for (const removedProduct of existingMap.values()) {
    removed.push(removedProduct);
  }

  return { newOrRefreshed, removed, updated };
}

module.exports = { diffProducts };
