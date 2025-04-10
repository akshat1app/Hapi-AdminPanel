import { Request, ResponseToolkit } from '@hapi/hapi';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Boom from '@hapi/boom';

export const login = async (req: Request, h: ResponseToolkit) => {
  const { email, password } = req.payload as { email: string; password: string };

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    throw Boom.unauthorized('Invalid email or password');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Boom.unauthorized('Invalid email or password');
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'Akshat@9090',
    { expiresIn: '1d' }
  );

  return h.response({ token }).code(200);
};
