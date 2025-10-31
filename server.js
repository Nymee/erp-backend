const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth-routes");
const companyRoutes = require("./routes/company-routes");
const userRoutes = require("./routes/user-routes");

const connectDB = require("./config/database");
const productRoutes = require("./routes/product-routes");
const salesRoutes = require("./routes/sales-routes");
const clientRoutes = require("./routes/client-routes");
const supplierRoutes = require("./routes/supplier-routes");
const cors = require("cors");

dotenv.config();
connectDB();
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/product", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/supplier", supplierRoutes);


app.listen(process.env.PORT, () => {
  console.log("listening");
});
