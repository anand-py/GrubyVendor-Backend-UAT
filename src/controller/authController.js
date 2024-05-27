const { db } = require('../config/firebaseConfig');
const { v4: uuidv4 } = require('uuid');

const sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const phoneNumberWithCountryCode = `+91${phoneNumber}`;

    // Currently not using OTP, so just return a success message
    res.status(200).send({
      message: 'OTP part is disabled, proceed without OTP'
    });
  } catch (error) {
    res.status(500).send('Error sending OTP: ' + error.message);
  }
};

const signup = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      email,
      shopName,
      shopAddress,
      bankDetails,
      fcmToken,
      isVerified
    } = req.body;

    // Check if email already exists
    const emailQuery = await db.collection('vendors').where('email', '==', email).get();
    if (!emailQuery.empty) {
      return res.status(400).send('Email already exists. Please use a different email.');
    }

    // Check if phone number already exists
    const phoneQuery = await db.collection('vendors').where('phoneNumber', '==', phoneNumber).get();
    if (!phoneQuery.empty) {
      return res.status(400).send('Phone number already exists. Please use a different phone number.');
    }

    // Check if shop name already exists
    const shopQuery = await db.collection('vendors').where('shopName', '==', shopName).get();
    if (!shopQuery.empty) {
      return res.status(400).send('Shop name already exists. Please use a different shop name.');
    }

    // Generate a UUID for the vendor
    const id = uuidv4();

    // Structure the data to match the provided schema
    const vendorData = {
      fullName,
      phoneNumber,
      email,
      shopName,
      shopAddress,
      bankDetails,
      fcmToken,
      id,
      isVerified: isVerified || false
    };

    // Save the vendor data in Firestore
    await db.collection('vendors').doc(id).set(vendorData);

    // Send response with vendor data upon successful signup
    res.status(201).send({
      message: 'Signup successful',
      vendor: vendorData
    });
  } catch (error) {
    res.status(500).send('Error signing up: ' + error.message);
  }
};

const login = async (req, res) => {
  try {
    const { phoneNumber, email } = req.body;

    // Fetch user data from Firestore based on phone number
    const phoneQuery = await db.collection('vendors').where('phoneNumber', '==', phoneNumber).get();

    if (phoneQuery.empty) {
      return res.status(404).send('User not found.');
    }

    const vendorData = phoneQuery.docs[0].data();

    // Check if the email matches
    if (vendorData.email !== email) {
      return res.status(400).send('Email does not match.');
    }

    res.status(200).send({
      message: 'Login successful',
      vendor: vendorData,
    });
  } catch (error) {
    res.status(500).send('Error logging in: ' + error.message);
  }
};

module.exports = {
  signup,
  login,
  sendOtp
};
