const User = require("../models/user");

const authenticateUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json("User does not exist");
    }

    if (password != user.password) {
      res.status(400).json("Incorrect password");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
