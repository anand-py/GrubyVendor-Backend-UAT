const { signup, login } = require('../src/controller/authController');
const { db } = require('../src/config/firebaseConfig');
const { v4: uuidv4 } = require('uuid');

jest.mock('uuid');
jest.mock('../config/firebaseConfig');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('signup', () => {
    it('should sign up a user successfully', async () => {
      uuidv4.mockReturnValue('uuid');
      const req = {
        body: {
          fullName: 'Anand',
          phoneNumber: '1234567890',
          email: 'anand@anand.com',
          shopName: 'Anand\'s Shop',
          shopAddress: '123 Main St',
          bankDetails: 'Bank details',
          fcmToken: 'fcmToken',
          isVerified: false,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      db.collection.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        get: jest.fn()
          .mockResolvedValueOnce({ empty: true }) // For email check
          .mockResolvedValueOnce({ empty: true }) // For phone number check
          .mockResolvedValueOnce({ empty: true }), // For shop name check
        doc: jest.fn().mockReturnThis(),
        set: jest.fn().mockResolvedValue(),
      });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Signup successful',
        vendor: expect.objectContaining({
          fullName: 'Anand Varama',
          phoneNumber: '1234567890',
          email: 'anand@anand.com',
          shopName: 'anand\'s Shop',
          shopAddress: '123 Main St',
          bankDetails: 'Bank details',
          fcmToken: 'fcmToken',
          id: 'uuid',
          isVerified: false,
        }),
      }));
    });

    it('should return error if email already exists', async () => {
      const req = {
        body: {
          fullName: 'Anand Varama',
          phoneNumber: '1234567890',
          email: 'existing@example.com',
          shopName: 'anand\'s Shop',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      db.collection.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({ empty: false }),
      });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Email already exists. Please use a different email.');
    });

    it('should return error if phone number already exists', async () => {
      const req = {
        body: {
          fullName: 'Anand Varama',
          phoneNumber: '1234567890',
          email: 'anand@anand.com',
          shopName: 'anand\'s Shop',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      db.collection.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        get: jest.fn()
          .mockResolvedValueOnce({ empty: true }) // For email check
          .mockResolvedValueOnce({ empty: false }) // For phone number check
      });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Phone number already exists. Please use a different phone number.');
    });

    it('should return error if shop name already exists', async () => {
      const req = {
        body: {
          fullName: 'Anand Varama',
          phoneNumber: '1234567890',
          email: 'anand@anand.com',
          shopName: 'Existing Shop',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      db.collection.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        get: jest.fn()
          .mockResolvedValueOnce({ empty: true }) // For email check
          .mockResolvedValueOnce({ empty: true }) // For phone number check
          .mockResolvedValueOnce({ empty: false }), // For shop name check
      });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Shop name already exists. Please use a different shop name.');
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const req = {
        body: {
          phoneNumber: '1234567890',
          email: 'anand@anand.com',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      db.collection.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({
          empty: false,
          docs: [{ data: () => ({ phoneNumber: '1234567890', email: 'john@example.com' }) }],
        }),
      });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Login successful',
        vendor: expect.objectContaining({
          phoneNumber: '1234567890',
          email: 'anand@anand.com',
        }),
      }));
    });

    it('should return error if user not found', async () => {
      const req = {
        body: {
          phoneNumber: '1234567890',
          email: 'anand@anand.com',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      db.collection.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({ empty: true }),
      });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('User not found.');
    });

    it('should return error if email does not match', async () => {
      const req = {
        body: {
          phoneNumber: '1234567890',
          email: 'wrong@example.com',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      db.collection.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({
          empty: false,
          docs: [{ data: () => ({ phoneNumber: '1234567890', email: 'anand@anand.com' }) }],
        }),
      });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Email does not match.');
    });
  });
});
