// Import necessary modules
const assert = require('assert');
const { manageMenu } = require('../src/controller/menuController');
const { db } = require('../src/config/firebaseConfig');

// Mock request and response objects
const mockRequest = (body) => ({ body });
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

// Test cases for manageMenu function
describe('Manage Menu', () => {
  it('should return status 200 and a success message when menu data is added/updated successfully', async () => {
    // Mock request body
    const req = mockRequest({
      isOpen: true,
      items: ['Pizza', 'Burger', 'Pasta'],
      openDetails: 'Mon-Sun: 9am-10pm',
      restaurantImageUrl: 'https://example.com/restaurant.jpg',
      restaurantLocation: '123 Main St, City',
      restaurantName: 'Foodie Cafe',
      vendorFcmToken: 'abc123',
      vendorId: 'vendor123'
    });
    const res = mockResponse();

    // Mock Firestore set function
    const setMock = jest.fn();
    db.collection = jest.fn(() => ({
      doc: jest.fn(() => ({
        set: setMock
      }))
    }));

    await manageMenu(req, res);

    // Verify if Firestore set function is called with correct data
    expect(db.collection).toHaveBeenCalledWith('menus');
    expect(setMock).toHaveBeenCalledWith({
      isOpen: true,
      items: ['Pizza', 'Burger', 'Pasta'],
      openDetails: 'Mon-Sun: 9am-10pm',
      restaurantImageUrl: 'https://example.com/restaurant.jpg',
      restaurantLocation: '123 Main St, City',
      restaurantName: 'Foodie Cafe',
      vendorFcmToken: 'abc123',
      vendorId: 'vendor123'
    });

    // Verify response status and message
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.message, 'Menu data added/updated successfully');
  });

  it('should return status 500 and an error message when required fields are missing', async () => {
    // Mock request body with missing required fields
    const req = mockRequest({});
    const res = mockResponse();

    await manageMenu(req, res);

    // Verify response status and error message
    assert.strictEqual(res.statusCode, 500);
    assert.strictEqual(res.data.message, 'Error managing menu data');
    assert.strictEqual(res.data.error, 'Missing required fields');
  });

  // Add more test cases for error scenarios if needed
});
