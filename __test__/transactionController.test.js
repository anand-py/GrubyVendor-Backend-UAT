// Import necessary modules
const assert = require('assert');
const { viewTransactionHistory } = require('../src/controller/transactionController');
const { db } = require('../src/config/firebaseConfig');

// Mock request and response objects
const mockRequest = (query) => ({ query });
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

// Test cases for viewTransactionHistory function
describe('View Transaction History', () => {
  it('should return status 400 and an error message when vendorId is missing', async () => {
    const req = mockRequest({});
    const res = mockResponse();

    await viewTransactionHistory(req, res);

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.data.message, 'Vendor ID is required');
  });

  it('should return status 200 and totalSales, totalOrders, totalEarnings as 0 when no transactions found', async () => {
    // Mock request with vendorId
    const req = mockRequest({ vendorId: 'vendor123' });
    const res = mockResponse();

    // Mock Firestore get function
    const getMock = jest.fn(() => ({ empty: true }));
    db.collection = jest.fn(() => ({
      where: jest.fn(() => ({ get: getMock }))
    }));

    await viewTransactionHistory(req, res);

    // Verify response status and data
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.message, 'No transactions found');
    assert.strictEqual(res.data.totalSales, 0);
    assert.strictEqual(res.data.totalOrders, 0);
    assert.strictEqual(res.data.totalEarnings, 0);
    assert.deepStrictEqual(res.data.transactions, []);
  });

  // Add more test cases for other scenarios if needed
});
