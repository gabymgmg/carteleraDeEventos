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
    if (!req.user)
      return res.status(401).json({ message: 'Usuario no autenticado' });
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Update fields if they are provided in the request body
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.businessName = req.body.businessName || user.businessName;
    user.businessAddress = req.body.businessAddress || user.businessAddress;
    user.description = req.body.description || user.description;
    // Save the new user data
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: 'Usuario no autenticado' });
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

// Change password for logged-in user
export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  try {
    if (!req.user)
      return res.status(401).json({ message: 'Usuario no autenticado' });
    const user = await User.findById(req.user._id).select('+password');
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    // Check if current password is correct
    if (!(await user.comparePassword(currentPassword))) {
      return res
        .status(400)
        .json({ message: 'La contraseña actual es incorrecta' });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error cambiando la contraseña', error });
  }
};
