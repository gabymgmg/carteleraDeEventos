import jwt from 'jsonwebtoken';

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.sign({ id }, secret, {
    expiresIn: '30d', // Token valid for 30 days
  });
};

export default generateToken;
