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
  password: 'password123!'
};
let userCreated;

describe('AuthController Tests', () => {
  before(async function () {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    this.timeout(10000);

    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  after(async () => {
    await mongoServer.stop();
    await mongoose.disconnect();
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app).post('/register').send(testUser);
    
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id');
      expect(mongoose.Types.ObjectId.isValid(res.body.id)).to.be.true;
      expect(res.body).to.have.property('email', 'bob@example.com');
    
      // Save the created user for later tests
      userCreated = res.body;

      // Check if the user is created successfully
      const user = await User.findOne({ email: testUser.email });
      expect(user).to.exist;
      expect(user.name).to.equal(testUser.name);
      expect(user.email).to.equal(testUser.email);
      // Password should be hashed
      expect(user.password).to.not.equal(testUser.password);
    });

    it('should not register a user with missing fields', async () => {
      // Missing data
      const res = await request(app).post('/register').send({
        name: '',
        email: '',
        password: '',
      });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error', 'Missing name');

      // Missing email
      const res1 = await request(app).post('/register').send({
        name: testUser.name,
        password: testUser.password,
      });
      expect(res1).to.have.status(400);
      expect(res1.body).to.have.property('error', 'Missing email');

      // Missing password
      const res2 = await request(app).post('/register').send({
        name: testUser.name,
        email: testUser.email,
      });
      expect(res2).to.have.status(400);
      expect(res2.body).to.have.property('error', 'Missing password');
    });

    it('should not register a user with an already registered email', async () => {
      const res = await request(app).post('/register').send({
        name: testUser.name,
        email: userCreated.email,
        password: testUser.password,
      });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error', 'User already exists');
    });
  });

  describe('POST /login', () => {
    it('should log in a user successfully with valid credentials', async () => {
      const res = await request(app).post('/login').send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token').that.is.a('string');
    });

    it('should not login with missing fields', async () => {
      // Missing data
      const res = await request(app).post('/login').send({
        email: '',
        password: '',
      });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error', 'Missing email');

      // Missing email
      const res1 = await request(app).post('/login').send({
        password: testUser.password,
      });
      expect(res1).to.have.status(400);
      expect(res1.body).to.have.property('error', 'Missing email');

      // Missing password
      const res2 = await request(app).post('/login').send({
        email: testUser.email,
      });
      expect(res2).to.have.status(400);
      expect(res2.body).to.have.property('error', 'Missing password');
    });


    it('should not log in a user with incorrect data', async () => {
      // Incorrect email
      const res = await request(app).post('/login').send({
        email: 'nonexistent@exmaple.com',
        password: testUser.password,
      });
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error', 'Invalid email or password');

      // Incorrect password
      const res1 = await request(app).post('/login').send({
        email: testUser.email,
        password: 'wrongPassword123',
      });
      expect(res1).to.have.status(401);
      expect(res1.body).to.have.property('error', 'Invalid email or password');
    });

    it('should not log in a user with incorrect data', async () => {
      const res = await request(app).post('/login').send({
        email: testUser.email,
        password: 'wrongPassword123',
      });
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error', 'Invalid email or password');
    });
  });
});
