import app from '@/api';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { cnpj } from 'cpf-cnpj-validator';
import { dataSource } from '@/infra/orm/typeorm/datasource';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('[POST] /auth/register', () => {
  let server: ReturnType<typeof supertest>;

  beforeAll(async () => {
    await dataSource.initialize();
    server = supertest(app);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should create an employer with a company', async () => {
    const input = {
      user: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'EMPLOYER'
      },
      company: {
        name: faker.company.name(),
        document: cnpj.generate(),
        contactName: faker.person.fullName(),
        phone: '61093427464'
      }
    };

    const response = await server.post('/auth/register').send(input);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      user: {
        email: input.user.email,
        id: expect.any(String),
        role: input.user.role
      },
      company: {
        id: expect.any(String),
        name: input.company.name,
        document: input.company.document,
        contactName: input.company.contactName,
        phone: input.company.phone
      }
    });
  });

  it('should create a candidate without a company', async () => {
    const input = {
      user: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'CANDIDATE'
      },
      candidate: {
        fullName: faker.person.fullName(),
        bio: faker.lorem.sentence(),
        phone: '61987654321'
      }
    };

    const response = await server.post('/auth/register').send(input);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      user: {
        email: input.user.email,
        id: expect.any(String),
        role: input.user.role
      },
      candidate: {
        id: expect.any(String),
        fullName: input.candidate.fullName,
        bio: input.candidate.bio,
        phone: input.candidate.phone,
        tags: []
      }
    });
  });

  it('should fail if email already exists', async () => {
    const email = faker.internet.email();
    const input1 = {
      user: {
        email,
        password: faker.internet.password(),
        role: 'EMPLOYER'
      },
      company: {
        name: faker.company.name(),
        document: cnpj.generate(),
        contactName: faker.person.fullName(),
        phone: '61093427464'
      }
    };

    await server.post('/auth/register').send(input1);

    const input2 = {
      user: {
        email,
        password: faker.internet.password(),
        role: 'CANDIDATE'
      },
      candidate: {
        fullName: faker.person.fullName(),
        bio: faker.lorem.sentence(),
        phone: '61987654321'
      }
    };

    const response = await server.post('/auth/register').send(input2);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('User with this email already exists');
  });

  it('should fail if company document already exists', async () => {
    const document = cnpj.generate();

    const input1 = {
      user: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'EMPLOYER'
      },
      company: {
        name: faker.company.name(),
        document,
        contactName: faker.person.fullName(),
        phone: '61093427464'
      }
    };

    await server.post('/auth/register').send(input1);

    const input2 = {
      user: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'EMPLOYER'
      },
      company: {
        name: faker.company.name(),
        document,
        contactName: faker.person.fullName(),
        phone: '61987654321'
      }
    };

    const response = await server.post('/auth/register').send(input2);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Company with this document already exists');
  });

  it('should fail when required fields are missing', async () => {
    const input = {
      user: {
        email: '',
        password: '',
        role: 'EMPLOYER'
      }
    };

    const response = await server.post('/auth/register').send(input);
    expect(response.status).toBe(400);
  });
});
