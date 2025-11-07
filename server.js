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
const inventoryRoutes = require("./routes/inventory-routes");
const cors = require("cors");
const { validateJWT, extractUserInfo } = require("./middlewares/auth");
const User = require("./models/User");

dotenv.config();
connectDB();
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());
app.get('/api/auth0/users/:auth0Id', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ACTION_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { auth0Id } = req.params;
  
  const user = await User.findOne({ auth0Id });
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    role: user.role,
    companyId: user.companyId?.toString(),
    branchId: user.branchId?.toString()
  });
});
app.use("/api/auth", authRoutes);

app.use(validateJWT);
app.use(extractUserInfo);

app.use("/api/company", companyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/product", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/inventory", inventoryRoutes);

app.listen(process.env.PORT, () => {
  console.log("listening");
});
