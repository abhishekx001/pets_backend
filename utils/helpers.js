const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase, supabaseAdmin } = require('../config/supabase');
const config = require('../config');

// Password utilities
const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// JWT utilities
const generateToken = (payload) => {
  try {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  } catch (error) {
    throw new Error('Error generating token');
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// File upload utilities
const uploadFileToStorage = async (file, fileName) => {
  try {
    // Validate file type
    if (!config.upload.allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    // Validate file size
    if (file.size > config.upload.maxFileSize) {
      throw new Error(`File too large. Maximum size is ${config.upload.maxFileSize / (1024 * 1024)}MB`);
    }

    // Use admin client for uploads to bypass RLS
    const client = supabaseAdmin || supabase;
    
    const { data: uploadData, error: uploadError } = await client.storage
      .from('pet-photos')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype
      });

    if (uploadError) {
      throw new Error(`Upload error: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = client.storage
      .from('pet-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    throw new Error(`File upload error: ${error.message}`);
  }
};

const generateFileName = (originalName) => {
  const fileExt = originalName.split('.').pop();
  return `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
};

// Response utilities
const sendSuccessResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendErrorResponse = (res, message = 'Internal server error', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

// Validation utilities
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  uploadFileToStorage,
  generateFileName,
  sendSuccessResponse,
  sendErrorResponse,
  isValidEmail,
  isValidPhone
};
