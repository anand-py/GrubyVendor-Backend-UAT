const { db, firebase } = require('../config/firebaseConfig');


const sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const phoneNumberWithCountryCode = `+91${phoneNumber}`;

    // Use Firebase Admin SDK to send the OTP
    const sessionInfo = await admin.auth().createSessionCookie(phoneNumberWithCountryCode, { expiresIn: 60 * 60 * 1000 });

    // Send response with session info upon successful OTP generation
    res.status(200).send({
      message: 'OTP sent successfully',
      sessionInfo,
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
      isVerified,
      otp,
      verificationId
    } = req.body;

    // Confirm the OTP
    const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, otp);
    const userCredential = await firebase.auth().signInWithCredential(credential);
    const user = userCredential.user;

    if (!user || user.phoneNumber !== `+91${phoneNumber}`) { // Adjust the country code as needed
      return res.status(400).send('Invalid OTP.');
    }

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
    const { phoneNumber, otp, verificationId } = req.body;

    // Confirm the OTP
    const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, otp);
    const userCredential = await firebase.auth().signInWithCredential(credential);
    const user = userCredential.user;

    if (!user || user.phoneNumber !== `+91${phoneNumber}`) { // Adjust the country code as needed
      return res.status(400).send('Invalid OTP.');
    }

    // Fetch user data from Firestore
    const phoneQuery = await db.collection('vendors').where('phoneNumber', '==', phoneNumber).get();

    if (phoneQuery.empty) {
      return res.status(404).send('User not found.');
    }

    const vendorData = phoneQuery.docs[0].data();

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
