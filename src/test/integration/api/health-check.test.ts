import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import supertest from 'supertest';
import app from '@/api';
import { dataSource } from '@/infra/orm/typeorm/datasource';

describe('[GET] /health', () => {
  let server: ReturnType<typeof supertest>;

  beforeAll(async () => {
    await dataSource.initialize();
    server = supertest(app);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should return 200 OK for health check', async () => {
    const response = await server.get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
