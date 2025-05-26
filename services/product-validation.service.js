function validateProduct(product) {
  const {
    cost_price,
    min_margin,
    max_margin,
    retail_margin,
    discount = 0,
    taxable_price = 0,
    margin_unit,
    gst = 0,
    cess = 0,
  } = product;

  const parsed = {
    cost_price: Number(cost_price),
    min_margin: Number(min_margin),
    max_margin: Number(max_margin),
    retail_margin: Number(retail_margin),
    discount: Number(discount),
    taxable_price: Number(taxable_price),
    margin_unit,
    gst: Number(gst),
    cess: Number(cess),
  };

  const {
    cost_price: cp,
    min_margin: min,
    max_margin: max,
    retail_margin: rm,
    discount: disc,
    margin_unit: unit,
    gst: gstRate,
    cess: cessRate,
  } = parsed;

  if (min >= max) {
    throw new Error("Min Margin should be less than max margin");
  }

  if (rm < min) {
    throw new Error("Retail margin is below the minimum allowed margin.");
  }

  if (rm > max) {
    throw new Error("Retail margin exceeds the maximum allowed margin.");
  }

  let retailMarginPrice = 0;
  let minMarginPrice = 0;
  let discountAmt = 0;
  let discountPrice = 0;

  if (unit === "per") {
    minMarginPrice = Number((cp + (cp * min) / 100).toFixed(2));
    retailMarginPrice = Number((cp + (cp * rm) / 100).toFixed(2));
    discountAmt = Number(((retailMarginPrice * disc) / 100).toFixed(2));
    discountPrice = Number((retailMarginPrice - discountAmt).toFixed(2));
  } else if (unit === "rup") {
    minMarginPrice = Number((cp + min).toFixed(2));
    retailMarginPrice = Number((cp + rm).toFixed(2));
    discountAmt = Number(disc.toFixed(2));
    discountPrice = Number((retailMarginPrice - disc).toFixed(2));
  } else {
    throw new Error("Invalid margin_unit. Must be 'per' or 'rup'.");
  }

  if (discountPrice < minMarginPrice) {
    throw new Error("Discount price should be greater than min margin price.");
  }

  const totalTaxRate = gstRate + cessRate;
  const salesPrice = Number(
    (discountPrice + (discountPrice * totalTaxRate) / 100).toFixed(2)
  );

  return {
    values: {
      min_margin_price: minMarginPrice,
      retail_margin_price: retailMarginPrice,
      discount_amount: discountAmt,
      discount_price: discountPrice,
      sales_price: salesPrice,
    },
  };
}

module.exports = validateProduct;
