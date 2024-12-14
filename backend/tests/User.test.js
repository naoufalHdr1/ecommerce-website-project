// tests/User.test.js

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User.js'
import { expect } from 'chai';

let mongoServer;

describe('User Model Tests', () => {
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

  it('should create a new user and hash the password', async () => {
    const user = await User.create('John Doe', 'john@example.com', 'password123');
    expect(user).to.have.property('_id');
    expect(user.name).to.equal('John Doe');
    expect(user.email).to.equal('john@example.com');
    expect(user.password).to.not.equal('password123');
  });

  it('should not allow creating a user with a duplicate email', async () => {
    await User.create('Jane Doe', 'jane@example.com', 'password123');
    try {
      await User.create('Jane Doe', 'jane@example.com', 'password456');
    } catch (err) {
      expect(err.message).to.include('User already exists');
    }
  });

  it('should update user details and hash password if included', async () => {
    const user = await User.create('Chris', 'chris@example.com', 'password123');
    const updatedUser = await User.update(user._id, { name: 'Chris Updated', password: 'newPass123' });
    expect(updatedUser.name).to.equal('Chris Updated');
    expect(updatedUser.password).to.not.equal('newPass123');
  });

  it('should throw an error when finding a user with an invalid ID', async () => {
    try {
      await User.findUserById('invalid-id');
    } catch (err) {
      expect(err.message).to.include('Cast to ObjectId failed');
    }
  });
});
