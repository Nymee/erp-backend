import cors from "cors";

const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth-routes");
const companyRoutes = require("./routes/company-routes");
const userRoutes = require("./routes/user-routes");

const connectDB = require("./config/database");
const productRoutes = require("./routes/product-routes");
const salesRoutes = require("./routes/sales-routes");
const clientRoutes = require("./routes/client-routes");

dotenv.config();
connectDB();
// const route =
app.use(cors()); // ✅ Enable CORS for all routes

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/product", productRoutes);
app.use("/api/sales", salesRoutes);

app.listen(process.env.PORT, () => {
  console.log("listening");
});
