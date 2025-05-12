const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    mobile: String,
    role: { type: String, enum: ["SAU", "SE", "MG", "ADMIN"], default: "SAU" },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: function () {
        return this.role !== "ADMIN";
      },
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: function () {
        return this.role !== "ADMIN";
      },
    },
    password: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
