const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("./models/User");
const Branch = require("./models/Branch");
const Supplier = require("./models/Supplier");
const Company = require("./models/Company");

dotenv.config();

async function testSupplier() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.dbUrl);
    console.log("Connected to MongoDB");

    // Find the company we just created
    const company = await Company.findOne({ email_id: "company@test.com" });
    if (!company) {
      console.log("Company not found. Please create a company first.");
      process.exit(1);
    }
    console.log("Found company:", company.name);

    // Create a branch
    let branch = await Branch.findOne({ companyId: company._id });
    if (!branch) {
      branch = await Branch.create({
        name: "Main Branch",
        companyId: company._id,
      });
      console.log("Created branch:", branch.name);
    } else {
      console.log("Found existing branch:", branch.name);
    }

    // Create a user with SAU role
    let user = await User.findOne({ email: "user@test.com" });
    if (!user) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      user = await User.create({
        name: "Test User",
        email: "user@test.com",
        mobile: "1234567890",
        role: "SAU",
        branchId: branch._id,
        companyId: company._id,
        password: hashedPassword,
      });
      console.log("Created user:", user.email);
    } else {
      console.log("Found existing user:", user.email);
    }

    // Create a supplier
    const supplier = await Supplier.create({
      name: "Test Supplier Inc",
      email_id: "supplier@test.com",
      mobile: "5555555555",
      address: "123 Supplier Street, City, Country",
      companyId: company._id,
      branchId: branch._id,
    });

    console.log("\n✓ Supplier created successfully!");
    console.log("Supplier details:", JSON.stringify(supplier, null, 2));

    // Verify we can read it back
    const foundSupplier = await Supplier.findById(supplier._id);
    console.log("\n✓ Supplier retrieved successfully!");
    console.log("Retrieved supplier:", foundSupplier.name);

    console.log("\n=== Test Summary ===");
    console.log("Company ID:", company._id);
    console.log("Branch ID:", branch._id);
    console.log("User ID:", user._id);
    console.log("User email:", user.email);
    console.log("User password: password123");
    console.log("Supplier ID:", supplier._id);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testSupplier();
