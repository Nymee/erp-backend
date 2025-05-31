function validateProduct(product, context) {
  const cost_price = Number(product.cost_price);
  const min_margin = Number(product.min_margin);
  const max_margin = Number(product.max_margin);
  const retail_margin = Number(product.retail_margin);
  const retail_margin_type = product.retail_margin_type;
  const discount_type = product.discount_type;
  const discount = Number(product.discount ?? 0); // Handles undefined/null
  const margin_unit = product.margin_unit;
  const gst = Number(product.gst ?? 0);
  const cess = Number(product.cess ?? 0);
  const quantity = Number(product.quantity ?? 1);

  const retail_margin_unit =
    context === "products" ? margin_unit : retail_margin_type;
  const discount_unit = context === "products" ? margin_unit : discount_type;

  if (min_margin >= max_margin) {
    throw new Error("Min margin should be less than max margin.");
  }

  if (retail_margin < min_margin) {
    throw new Error("Retail margin is below the minimum allowed margin.");
  }

  if (retail_margin > max_margin) {
    throw new Error("Retail margin exceeds the maximum allowed margin.");
  }

  let retailMarginPrice = 0;
  let minMarginPrice = 0;
  let maxMarginPrice = 0;
  let discountAmt = 0;
  let discountPrice = 0;

  if (margin_unit === "per") {
    minMarginPrice = Number(
      (cost_price + (cost_price * min_margin) / 100).toFixed(2)
    );
    maxMarginPrice = Number(
      (cost_price + (cost_price * max_margin) / 100).toFixed(2)
    );
  } else if (margin_unit === "rup") {
    minMarginPrice = Number((cost_price + min_margin).toFixed(2));
    maxMarginPrice = Number((cost_price + max_margin).toFixed(2));
  } else {
    throw new Error("Invalid margin_unit. Must be 'per' or 'rup'.");
  }

  if (retail_margin_unit === "per") {
    retailMarginPrice = Number(
      (cost_price + (cost_price * retail_margin) / 100).toFixed(2)
    );
  } else if (retail_margin_unit === "rup") {
    retailMarginPrice = Number((cost_price + retail_margin).toFixed(2));
  } else {
    throw new Error("Invalid retail_margin_type. Must be 'per' or 'rup'.");
  }

  if (discount_unit === "per") {
    discountAmt = Number(((retailMarginPrice * discount) / 100).toFixed(2));
  } else if (discount_unit === "rup") {
    discountAmt = Number(discount.toFixed(2));
  } else {
    throw new Error("Invalid discount_type. Must be 'per' or 'rup'.");
  }

  discountPrice = Number((retailMarginPrice - discountAmt).toFixed(2));

  if (discountPrice < minMarginPrice) {
    throw new Error("Discount price should be greater than min_margin price.");
  }

  const totalTaxRate = gst + cess;
  const salesPrice = Number(
    (discountPrice + (discountPrice * totalTaxRate) / 100).toFixed(2)
  );

  if (context == "product") {
    return {
      values: {
        min_margin_price: minMarginPrice,
        max_margin_price: maxMarginPrice,
        retail_margin_price: retailMarginPrice,
        discount_amount: discountAmt,
        discount_price: discountPrice,
        sales_price: salesPrice,
      },
    };
  } else if (context == "sales") {
    return {
      values: {
        cost_price: cost_price,
        min_margin: min_margin,
        max_margin: max_margin,
        margin_unit: margin_unit,

        retail_margin: retail_margin,
        retail_margin_type: retail_margin_type,

        discount: discount,
        discount_type: discount_type,

        gst: gst,
        cess: cess,
        sales_price: salesPrice,

        total_sales_price: salesPrice * quantity,
      },
    };
  }
}

module.exports = validateProduct;
