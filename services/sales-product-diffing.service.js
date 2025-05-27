function diffProducts(existingProducts, incomingProducts) {
  const existingMap = new Map();
  const added = [];
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
      added.push(incoming);
    } else {
      const isModified =
        incoming.quantity !== existing.quantity ||
        incoming.client_margin !== existing.client_margin ||
        incoming.client_margin_type !== existing.client_margin_type ||
        incoming.discount !== existing.discount ||
        incoming.discount_type !== existing.discount_type;

      if (isModified) {
        updated.push({ from: existing, to: incoming });
      }

      existingMap.delete(id); // Mark as processed
    }
  }

  // Anything still in existingMap was removed
  for (const removedProduct of existingMap.values()) {
    removed.push(removedProduct);
  }

  return { added, removed, updated };
}
