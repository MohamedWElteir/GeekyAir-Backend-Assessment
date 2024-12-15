const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const twilio = require('twilio')
const jwt = require("jsonwebtoken");

/**
 * {
 *    username: 'user',
 *    password: 'passw122',
 *    role: 'user',
 *    phoneNumber: 1234567890
 * 
 * }
 */
exports.signup = async (req, res) => {

  const { username, password, role, phoneNumber } = req.body;

  try {
    const existingUser = await userModel.findUserById(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await userModel.createUser(username, passwordHash, role, phoneNumber);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error signing up", error: err.message });
  }
};


exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

   
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};



exports.requestPasswordReset = async (req, res) => {
    const { username } = req.body; 

    try {
       
        const user = await userModel.findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1-hour expiry

        
        await userModel.saveResetToken(user.id, resetToken, resetTokenExpiry);

        
        const accountSid = process.env.TWILIO_ACCOUNT_SID; 
        const authToken = process.env.TWILIO_AUTH_TOKEN; 
        const client = twilio(accountSid, authToken);

        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        const messageBody = `You requested a password reset. Use the following link to reset your password: ${resetUrl}. This link expires in 1 hour.`;

        await client.messages.create({
            body: messageBody,
            from: process.env.TWILIO_PHONE_NUMBER, 
            to: user.phoneNumber,                
        });

        res.status(200).json({ message: 'Password reset SMS sent successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error requesting password reset', error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
       
        const user = await userModel.findUserByResetToken(token);
        if (!user || user.resetTokenExpiry < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        
        await userModel.updatePassword(user.id, hashedPassword);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error resetting password', error: err.message });
    }
};