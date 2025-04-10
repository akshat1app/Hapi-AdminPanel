import { Request, ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';
import User from '../models/user.model';
import { hashPassword } from '../utils/hash';

export const registerSuperAdmin = async (req: Request, h: ResponseToolkit) => {
  try {
    const { email, password } = req.payload as {
      email: string;
      password: string;
    };

    const existing = await User.findOne({ role: 'superadmin' });

    if (existing) {
      throw Boom.conflict('Super Admin already exists');
    }

    const user = new User({
      email,
      password: await hashPassword(password),
      role: 'superadmin',
    });

    await user.save();

    return h.response({ msg: 'Super Admin created successfully' }).code(201);

  } catch (error) {
    console.error('Register Super Admin Error:', error);

    if (Boom.isBoom(error)) throw error;

    throw Boom.internal('Failed to register Super Admin');
  }
};
