const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const connectDB = require("./config/database");
const productRoutes = require("./routes/productRoutes");

dotenv.config();
connectDB();
// const route =
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", productRoutes);

app.listen(process.env.PORT, () => {
  console.log("listening");
});
