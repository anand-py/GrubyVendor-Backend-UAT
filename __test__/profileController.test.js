// Import necessary modules
const assert = require('assert');
const { updateProfile } = require('../src/controller/profileController');
const { db } = require('../src/config/firebaseConfig');

// Mock request and response objects
const mockRequest = (params, body) => ({ params, body });
const mockResponse = () => {
  const res = {};
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };
  res.json = (data) => {
    res.data = data;
    return res;
  };
  return res;
};

// Test cases for updateProfile function
describe('Update Profile', () => {
  it('should return status 200 and a success message when profile is updated successfully', async () => {
    // Mock request with vendorId and profile data
    const req = mockRequest({ vendorId: 'vendor123' }, {
      fullName: 'John Doe',
      phoneNumber: '1234567890',
      email: 'john@example.com',
      shopName: 'Doe Store',
      shopAddress: '123 Main St',
      bankDetails: '123456789',
      fcmToken: 'abc123',
      isVerified: true
    });
    const res = mockResponse();

    // Mock Firestore set function
    const setMock = jest.fn();
    db.collection = jest.fn(() => ({
      doc: jest.fn(() => ({
        set: setMock
      }))
    }));

    await updateProfile(req, res);

    // Verify if Firestore set function is called with correct data
    expect(db.collection).toHaveBeenCalledWith('vendors');
    expect(setMock).toHaveBeenCalledWith({
      fullName: 'John Doe',
      phoneNumber: '1234567890',
      email: 'john@example.com',
      shopName: 'Doe Store',
      shopAddress: '123 Main St',
      bankDetails: '123456789',
      fcmToken: 'abc123',
      isVerified: true
    }, { merge: true });

    // Verify response status and message
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.message, 'Profile updated successfully');
  });

  // Add more test cases for other scenarios if needed
});
