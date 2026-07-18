const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prismaClient');
const logger = require('../utils/logger');

// Helpers for token generation
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Register controller
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Public sign-up can only create an agent account. Privileged roles are created by an administrator.
    const userRole = 'AGENT';

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: userRole,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      }
    });

    logger.info(`User registered successfully: ${user.email} with role: ${user.role}`);

    return res.status(201).json({
      message: 'User registered successfully',
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error('Registration error: %o', error);
    return res.status(500).json({ message: 'Internal server error during registration' });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      }
    });

    logger.info(`User logged in successfully: ${user.email}`);

    // Exclude password from output
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error('Login error: %o', error);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
};

// Refresh token controller
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // Check if refresh token is in DB
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      return res.status(401).json({ message: 'Refresh token not recognized' });
    }

    if (new Date() > tokenRecord.expiresAt) {
      // Clean up expired token
      await prisma.refreshToken.delete({ where: { token: refreshToken } });
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    if (!tokenRecord.user.isActive) {
      return res.status(403).json({ message: 'User account is deactivated' });
    }

    // Rotate refresh token: delete old, create new
    await prisma.refreshToken.delete({
      where: { token: refreshToken }
    });

    const newAccessToken = generateAccessToken(tokenRecord.user);
    const newRefreshToken = generateRefreshToken(tokenRecord.user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: tokenRecord.user.id,
        expiresAt,
      }
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    logger.error('Token refresh error: %o', error);
    return res.status(500).json({ message: 'Internal server error during token refresh' });
  }
};

// Logout controller
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Remove from DB if it exists
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
      });
    }

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    logger.error('Logout error: %o', error);
    return res.status(500).json({ message: 'Internal server error during logout' });
  }
};

// Get Profile controller
const getProfile = async (req, res) => {
  // req.user is populated by authenticate middleware
  return res.status(200).json({ user: req.user });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getProfile,
};
