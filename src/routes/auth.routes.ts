import { login } from '../controllers/auth.controller';
import Joi from 'joi';
import { ServerRoute } from '@hapi/hapi';

const authRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/login',
    handler: login,
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        }),
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  },
];

export default authRoutes;
