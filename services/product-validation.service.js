class ProductValidator {
  constructor(product) {
    this.product = product;

    const {
      cost_price,
      min_margin,
      max_margin,
      retail_margin,
      discount,
      taxable_price,
      margin_unit,
      gst,
      cess,
    } = product;

    this.cost_price = Number(cost_price);
    this.min_margin = Number(min_margin);
    this.max_margin = Number(max_margin);
    this.retail_margin = Number(retail_margin);
    this.discount = Number(discount);
    this.taxable_price = Number(taxable_price);
    this.margin_unit = margin_unit;
    this.gst = Number(gst);
    this.cess = Number(cess);

    this.discountAmt = 0;
    this.retailMarginPrice = 0;
    this.salesPrice = 0;
    this.discountPrice = 0;
    this.minMarginPrice = 0;

    this.error = null;
  }

  minMaxValidator() {
    if (this.min_margin >= this.max_margin) {
      this.error = "Min Margin should be less than max margin";
      return false;
    }
    return true;
  }

  retailMarginValidator() {
    if (this.retail_margin < this.min_margin) {
      this.error = "Retail margin is below the minimum allowed margin.";
      return false;
    }

    if (this.retail_margin > this.max_margin) {
      this.error = "Retail margin exceeds the maximum allowed margin.";
      return false;
    }
    return true;
  }

  discountAmountValidator() {
    if (this.margin_unit === "per") {
      this.minMarginPrice = Number(
        (this.cost_price + (this.cost_price * this.min_margin) / 100).toFixed(2)
      );

      this.retailMarginPrice = Number(
        (
          this.cost_price +
          (this.cost_price * this.retail_margin) / 100
        ).toFixed(2)
      );

      this.discountAmt = Number(
        ((this.retailMarginPrice * this.discount) / 100).toFixed(2)
      );

      this.discountPrice = Number(
        (this.retailMarginPrice - this.discountAmt).toFixed(2)
      );
    }

    if (this.margin_unit === "rup") {
      this.minMarginPrice = Number(
        (this.cost_price + this.min_margin).toFixed(2)
      );

      this.retailMarginPrice = Number(
        (this.cost_price + this.retail_margin).toFixed(2)
      );

      this.discountAmt = Number(this.discount.toFixed(2));

      this.discountPrice = Number(
        (this.retailMarginPrice - this.discount).toFixed(2)
      );
    }

    if (this.discountPrice < this.minMarginPrice) {
      this.error = "Discount price should be greater than min margin price.";
      return false;
    }

    return true;
  }

  validateProduct() {
    if (
      !this.minMaxValidator() ||
      !this.retailMarginValidator() ||
      !this.discountAmountValidator()
    ) {
      const error = new Error();
      error.name = "ProductValidationError";
      error.message = this.error;
      throw error;
    } else {
      this.calculateSalesPrice();
      this.calculateExtraValues();

      return {
        values: {
          cost_price: this.cost_price,
          min_margin_price: this.minMarginPrice,
          retail_margin_price: this.retailMarginPrice,
          discount_amount: this.discountAmt,
          discount_price: this.discountPrice,
          sales_price: this.salesPrice,
        },
      };
    }
  }

  calculateSalesPrice() {
    const totalTaxRate = this.gst + this.cess;

    this.salesPrice = Number(
      (this.discountPrice + (this.discountPrice * totalTaxRate) / 100).toFixed(
        2
      )
    );
  }

  calculateExtraValues() {
    // Extend with more computations if needed
  }
}

module.exports = ProductValidator;
