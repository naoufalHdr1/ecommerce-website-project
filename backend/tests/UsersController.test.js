// tests/User.test.js

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User.js'
import chaiHttp from 'chai-http';
import { use, expect } from 'chai';
import app from '../server.js';

const chai = use(chaiHttp);
const request = chai.request.execute;

let mongoServer;
let testUser = {
  name: 'Bob',
  email: 'bob@example.com',
  password: 'password123'
};
let userCreated;

describe('UsersController Tests', () => {
  before(async function () {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    this.timeout(5000);

    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  after(async () => {
    await mongoServer.stop();
    await mongoose.disconnect();
  });

  it('POST /users/create - should create a new user', (done) => {
    request(app)
      .post('/users/create')
      .send(testUser)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('email', 'bob@example.com');
        expect(res.body).to.have.property('id');
        // Save the created user for later tests
        userCreated = res.body;
        done();
      });
  });

  it('POST /users/create - should fail with missing fields', (done) => {
    request(app)
      .post('/users/create')
      .send({ email: 'missing-fields@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'Name, email, and password are required');
        done();
      });
  });

  it('POST /users/create - should fail with existing user', (done) => {
    request(app)
      .post('/users/create')
      .send(testUser)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'User already exists');
        done();
      });
  });

  it('GET /users/find/:id - should return a user by ID', (done) => {
    request(app)
      .get(`/users/find/${userCreated.id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id', userCreated.id);
        expect(res.body).to.have.property('email', 'bob@example.com');
        done();
      });
  });

  it('GET /users/find/:id - should fail with no existing user', (done) => {
    const randomObjectId = new mongoose.Types.ObjectId();
    request(app)
      .get(`/users/find/${randomObjectId}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'User not found');
        done();
      });
  });

  it('PUT /users/update/:id - should update user details', (done) => {
    request(app)
      .put(`/users/update/${userCreated.id}`)
      .send({ name: 'Jhon' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('name', 'Jhon');
        expect(res.body).to.have.property('_id', userCreated.id);
        expect(res.body).to.have.property('email', userCreated.email);
        done();
      });
  });

  it('PUT /users/update/:id - should fail if id not valid', (done) => {
    const randomObjectId = new mongoose.Types.ObjectId();
    request(app)
      .put(`/users/update/${randomObjectId}`)
      .send({ name: 'Jhon' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'User not found');
        done();
      });
  });

  it('PUT /users/update/:id - should fail if no data found', (done) => {
    const randomObjectId = new mongoose.Types.ObjectId();
    request(app)
      .put(`/users/update/${randomObjectId}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'No data provided for update');
        done();
      });
  });

  it('DELETE /users/delete/:id - should delete a user', async () => {
    let res = await request(app).delete(`/users/delete/${userCreated.id}`)
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('_id', userCreated.id);
    expect(res.body).to.have.property('name', 'Jhon');
    expect(res.body).to.have.property('email', userCreated.email);

    // Check if the user exist after deletion
    res = await request(app).get(`/users/find/${userCreated.id}`);
    expect(res).to.have.status(400);
    expect(res.body).to.have.property('error', 'User not found');
  });
});
