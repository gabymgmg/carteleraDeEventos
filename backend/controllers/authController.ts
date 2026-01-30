import { Request, Response } from "express";
import User from '../src/models/User';
import jwt from 'jsonwebtoken';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, businessName, businessAddress, description } = req.body;
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

    if(user) {  
        res.status(201).json({ 
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: 'User registered successfully'
        });
    }
} catch (error) {     
      res.status(500).json({ message: 'Error registering user', error });
    }                                   
};