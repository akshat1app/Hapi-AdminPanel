import subadminRoutes from './subadmin.routes';
import authRoutes from './auth.routes';
import { registerSuperAdmin } from '../controllers/super.controller';
import { createSuperAdminSchema } from '../validators/user.validator';
import { ServerRoute } from '@hapi/hapi';

const routes: ServerRoute[] = [
  ...authRoutes,
  ...subadminRoutes,
  {
    method: 'POST',
    path: '/superadmin/register',
    handler: registerSuperAdmin,
    options: {
      auth: false,
      validate: {
        payload: createSuperAdminSchema,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  },
];

export default routes;
