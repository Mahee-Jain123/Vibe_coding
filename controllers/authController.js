const bcrypt = require('bcrypt');
const User = require('../model/user');

const register = async (req, res) => {
  try {
    // 1. Read username, email, and password from req.body
    const { username, email, password } = req.body || {};

    // 2. Validate that all three are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Username, email, and password are required.',
      });
    }

    // 3. Check whether the username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        message: 'Username already exists.',
      });
    }

    // 4. Check whether the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: 'Email already exists.',
      });
    }

    // 5. Hash the password using bcrypt before saving it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 6. Create a new User using the existing User model
    // Do NOT accept a role from req.body; schema default handles it
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // 7. Save the user to MongoDB
    await newUser.save();

    // 8. Return an appropriate success response without returning password/hash
    return res.status(201).json({
      message: 'User registered successfully.',
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({
      message: 'Server error during registration.',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    // 1. Read email and password from req.body
    const { email, password } = req.body || {};

    // 2. Validate that both fields are provided
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    // 3. Search in MongoDB for the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password.',
      });
    }

    // 4. Verify password with bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: 'Invalid email or password.',
      });
    }

    // 5. Return login successful message
    return res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      message: 'Server error during login.',
      error: error.message,
    });
  }
};

module.exports = { register, login };
