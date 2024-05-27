// Import necessary modules
const assert = require('assert');
const { signup, login } = require('../src/controller/authController');
const { db } = require('../src/config/firebaseConfig');

// Mock request and response objects
const mockRequest = (body) => ({ body });
const mockResponse = () => {
  const res = {};
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };
  res.send = (data) => {
    res.data = data;
    return res;
  };
  return res;
};

// Test cases for signup function
describe('Signup', () => {
  it('should return status 201 and a success message with vendor data when signup is successful', async () => {
    const req = mockRequest({
      fullName: 'John Doe',
      phoneNumber: '1234567890',
      email: 'john@example.com',
      shopName: 'Doe Store',
      shopAddress: '123 Main St',
      bankDetails: '123456789',
      fcmToken: 'abc123',
      isVerified: false
    });
    const res = mockResponse();

    await signup(req, res);

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.data.message, 'Signup successful');
    assert.strictEqual(res.data.vendor.fullName, 'John Doe');
   
  });

 
});

// Test cases for login function
describe('Login', () => {
  it('should return status 200 and a success message with vendor data when login is successful', async () => {
    // First, create a vendor for testing purposes
    const vendorData = {
      fullName: 'John Doe',
      phoneNumber: '1234567890',
      email: 'john@example.com',
      shopName: 'Doe Store',
      shopAddress: '123 Main St',
      bankDetails: '123456789',
      fcmToken: 'abc123',
      isVerified: false
    };
    await db.collection('vendors').doc('testVendorId').set(vendorData);

    const req = mockRequest({
      phoneNumber: '1234567890',
      email: 'john@example.com'
    });
    const res = mockResponse();

    await login(req, res);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.message, 'Login successful');
    assert.deepStrictEqual(res.data.vendor, vendorData);
  });

  
});
