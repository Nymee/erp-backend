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
app.use(cors({
  origin: [
    'https://do9w53h57qmus.cloudfront.net',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());
// Trust CloudFront proxy
app.set('trust proxy', true);

// Force HTTPS interpretation based on CloudFront headers
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'http') {
    req.headers['x-forwarded-proto'] = 'https';
  }
  next();
});

app.use('/api', (req, res, next) => {
  console.log('=== Incoming Request ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Authorization header:', req.headers.authorization);
  console.log('=======================');
  next();
});
app.use((req, res, next) => {
  if (req.path.includes('/api/auth0')) {
    console.log('🔍 Auth header received:', req.headers.authorization);
    console.log('🔍 Expected:', `Bearer ${process.env.ACTION_SECRET}`);
    console.log('🔍 ACTION_SECRET from env:', process.env.ACTION_SECRET);
  }
  next();
});
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

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





































