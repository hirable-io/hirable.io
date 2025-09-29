import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'API',
    description: 'Documentação automática com Swagger',
  },
  host: `localhost:${process.env.PORT}`,
  schemes: ['http'],
};

const outputFile = './src/infra/docs/swagger/swagger-output.json';
const endpointsFiles = ['./src/api/index.ts',
  './src/api/routes/auth-route.ts',
];

swaggerAutogen()(outputFile, endpointsFiles, doc);
