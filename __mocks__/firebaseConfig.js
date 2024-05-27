// __mocks__/firebaseConfig.js

const firebaseMock = require('firebase-mock');
const mockAuth = new firebaseMock.MockAuthentication();
const mockFirestore = new firebaseMock.MockFirestore();
const mockSdk = new firebaseMock.MockFirebaseSdk(
  () => null,
  () => mockAuth,
  () => mockFirestore
);

const admin = {
  auth: jest.fn(() => mockAuth),
};

const db = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      set: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
    })),
    where: jest.fn(() => ({
      get: jest.fn(),
    })),
  })),
};

const firebase = mockSdk;

module.exports = { db, firebase, admin };
