import {
  createSubAdmin,
  deleteSubAdmin,
  getSubAdmin,
  listSubAdmins,
  updateSubAdmin,
} from '../controllers/subadmin.controller';

import { ServerRoute } from '@hapi/hapi';
import { createSubAdminSchema, updateSubAdminSchema } from '../validators/user.validator';
import Joi from 'joi';

const subadminRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/subadmin',
    handler: createSubAdmin,
    options: {
      validate: {
        payload: createSubAdminSchema,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/subadmin',
    handler: listSubAdmins,
    options: {
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(10),
        }),
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/subadmin/{id}',
    handler: getSubAdmin,
  },
  {
    method: 'PUT',
    path: '/subadmin/{id}',
    handler: updateSubAdmin,
    options: {
      validate: {
        payload: updateSubAdminSchema,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  },
  {
    method: 'DELETE',
    path: '/subadmin/{id}',
    handler: deleteSubAdmin,
  },
];

export default subadminRoutes;
