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

const db = mockFirestore.firestore();
const firebase = mockSdk;

module.exports = { db, firebase, admin };
