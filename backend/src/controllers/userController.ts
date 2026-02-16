import { Request, Response } from 'express';
import User from '../models/User';

export const approveUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error approving user', error });
  }
};

export const getPendingUsers = async (req: Request, res: Response) => {
  try {
    const pendingUsers = await User.find({ isApproved: false });
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending users', error });
  }
};

export const editUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Usuario no autenticado' });
    const { name, email, businessName, businessAddress, description } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, businessName, businessAddress, description },
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id; // Assuming req.user is set by auth middleware
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
   }  
  }
