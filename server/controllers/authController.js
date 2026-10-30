const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new guest or user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, address, governmentId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      role: role && ['admin', 'staff', 'guest'].includes(role) ? role : 'guest',
      vipTier: 'Standard',
      address: address || '',
      governmentId: governmentId || ''
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        vipTier: newUser.vipTier
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        vipTier: user.vipTier,
        address: user.address,
        governmentId: user.governmentId
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

// @route   GET /api/auth/me
// @desc    Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        vipTier: user.vipTier,
        address: user.address,
        governmentId: user.governmentId
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
};

// @route   PUT /api/auth/profile
// @desc    Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, governmentId } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name: name || req.user.name,
          phone: phone !== undefined ? phone : req.user.phone,
          address: address !== undefined ? address : req.user.address,
          governmentId: governmentId !== undefined ? governmentId : req.user.governmentId
        }
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        vipTier: updatedUser.vipTier,
        address: updatedUser.address,
        governmentId: updatedUser.governmentId
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Profile update failed', error: error.message });
  }
};

// @route   GET /api/auth/users
// @desc    Get all users (admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const sanitized = users.map(u => ({
      id: u._id,
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      vipTier: u.vipTier,
      address: u.address,
      createdAt: u.createdAt
    }));
    return res.json({ success: true, count: sanitized.length, users: sanitized });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

