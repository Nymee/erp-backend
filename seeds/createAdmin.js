const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User"); // Adjust path if needed

const createDefaultAdmin = async () => {
  try {
    // Check if an admin user already exists
    const existingAdmin = await User.findOne({ role: "ADMIN" });

    if (!existingAdmin) {
      // If no admin exists, create one
      const hashedPassword = await bcrypt.hash("admin123", 10); // Set a temp password here

      await User.create({
        name: "ERP Super Admin",
        email: "admin@erp.com",
        mobile: "1234567890", // Sample mobile
        role: "ADMIN",
        password: hashedPassword,
        // Note: We are not including `companyId` and `branchId` for the admin
      });

      console.log("Default Admin created successfully.");
    } else {
      console.log("Admin already exists.");
    }
  } catch (err) {
    console.error("Error creating default admin:", err);
  }
};

module.exports = createDefaultAdmin;
