import Hapi from '@hapi/hapi';
import routes from './routes/super.routes';
import { connectDB  } from './config/db';
import dotenv from 'dotenv';
import Jwt from '@hapi/jwt';

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
  });

  await server.register(Jwt);

  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET || "Akshat@9090",
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 86400,
    },
    validate: async (artifacts: any, request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return {
        isValid: true,
        credentials: artifacts.decoded.payload,
      };
    },
  });

  server.auth.default('jwt');

  await connectDB(); 

  server.route(routes);

  await server.start();
  console.log('Server running on', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
