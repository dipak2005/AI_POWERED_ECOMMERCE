const User = require("../models/user");
const bcrypt = require("bcrypt");

module.exports.signup = async (req, res) => {
  try {
    const { email, password, name, type, phone, address } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email, type });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      type,
      phone,
      address,
    });

    console.log(newUser);

    await newUser.save();
    console.log(newUser);

    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Signup Error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    return res.status(200).json({ message: "Logged in successfully", user }); // No token, just user info
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getProfile = async (req, res) => {
  try {
    const { email, name, type } = req.body;

    // Ensure at least one parameter is provided
    if (!email && !name) {
      return res.status(400).json({ message: "Email or name is required" });
    }

    let query = {};

    // Build query based on which parameters are provided
    if (email) query.email = email;
    if (name) query.name = name;
    if (type) query.type = type;

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      user: {
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        type: user.type,
      },
    }); // Send back user info without the password
  } catch (err) {
    console.error("Get Profile Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deleteProfile = async (req, res) => {
  try {
    const { email, name, type } = req.body;

    // Ensure at least one parameter is provided
    if (!email && !name) {
      return res.status(400).json({ message: "Email or name is required" });
    }

    let query = {};

    // Build query based on which parameters are provided
    if (email) query.email = email;
    if (name) query.name = name;
    if (type) query.type = type;

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user from the database
    await User.deleteOne(query);

    return res
      .status(200)
      .json({ message: "User profile deleted successfully" });
  } catch (err) {
    console.error("Delete Profile Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
