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
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: 'User registered successfully',
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
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Request password reset
export const forgotPassword = async (req:Request, res:Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: 'If that account exists, an email has been sent.' }); // Avoids email enumeration
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Hash the token before saving to DB for security
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // Set token and expiration on user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
    
    await user.save();

    // Mocking email sending
    console.log(`Password reset link: http://yourfrontend.com/reset-password?token=${resetToken}&email=${email}`);
    console.log(`Raw Token (Send this to user): ${resetToken}`);
    console.log(`URL: http://localhost:5173/reset-password/${resetToken}`);

    res.status(200).json({ message: 'Reset link generated' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error });
  }   
};
