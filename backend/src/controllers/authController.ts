import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import crypto from 'crypto';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      businessName,
      businessAddress,
      description,
    } = req.body;
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Create user - role is set to owner by default (ignored)
    const user = await User.create({
      name,
      email,
      password,
      businessName,
      businessAddress,
      description,
      role: 'owner',
      isApproved: false, // New users need approval
    });

    if (user) {
      res.status(201).json({
        message:
          'Registration successful. Your account is pending administrator approval.',
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Log in a user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      // Check for approval
      if (!user.isApproved) {
        return res.status(403).json({
          message: 'Your account is pending approval.',
        });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Email o contraseña inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Request password reset
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: 'If that account exists, an email has been sent.' }); // Avoids email enumeration
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Hash the token before saving to DB for security
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    // Set token and expiration on user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await user.save();

    // Mocking email sending
    console.log(
      `Password reset link: http://yourfrontend.com/reset-password?token=${resetToken}&email=${email}`
    );
    console.log(`Raw Token (Send this to user): ${resetToken}`);
    console.log(`URL: http://localhost:5173/reset-password/${resetToken}`);

    res.status(200).json({ message: 'Reset link generated' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  const token = req.params.token as string; // Comes from URL
  const { password } = req.body; // New password from uthe form
  try {
    // Hash the received token to compare with DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    // Find user by token and check if token is not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }, // Token expiration in the future
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update password and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
};
