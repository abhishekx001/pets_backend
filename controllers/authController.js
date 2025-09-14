const User = require('../models/User');
const { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  sendSuccessResponse, 
  sendErrorResponse 
} = require('../utils/helpers');

class AuthController {
  // Register new user
  static async register(req, res) {
    try {
      const { email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return sendErrorResponse(res, 'User already exists with this email', 400);
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const newUser = await User.create({
        email,
        password: hashedPassword
      });

      // Generate JWT token
      const token = generateToken({
        userId: newUser.id,
        email: newUser.email
      });

      // Remove password from response
      const userResponse = {
        id: newUser.id,
        email: newUser.email,
        created_at: newUser.created_at
      };

      return sendSuccessResponse(res, {
        user: userResponse,
        token
      }, 'User registered successfully', 201);

    } catch (error) {
      console.error('Registration error:', error);
      return sendErrorResponse(res, 'Registration failed. Please try again.');
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return sendErrorResponse(res, 'Invalid email or password', 401);
      }

      // Check password
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return sendErrorResponse(res, 'Invalid email or password', 401);
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email
      });

      // Remove password from response
      const userResponse = {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      };

      return sendSuccessResponse(res, {
        user: userResponse,
        token
      }, 'Login successful');

    } catch (error) {
      console.error('Login error:', error);
      return sendErrorResponse(res, 'Login failed. Please try again.');
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return sendErrorResponse(res, 'User not found', 404);
      }

      // Remove password from response
      const userResponse = {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at
      };

      return sendSuccessResponse(res, userResponse, 'Profile retrieved successfully');

    } catch (error) {
      console.error('Get profile error:', error);
      return sendErrorResponse(res, 'Failed to retrieve profile');
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const { email } = req.body;
      const userId = req.user.userId;

      // Check if email is being changed and if it already exists
      if (email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return sendErrorResponse(res, 'Email already in use', 400);
        }
      }

      // Update user
      const updatedUser = await User.update(userId, { email });

      // Remove password from response
      const userResponse = {
        id: updatedUser.id,
        email: updatedUser.email,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at
      };

      return sendSuccessResponse(res, userResponse, 'Profile updated successfully');

    } catch (error) {
      console.error('Update profile error:', error);
      return sendErrorResponse(res, 'Failed to update profile');
    }
  }
}

module.exports = AuthController;
