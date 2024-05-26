const { db } = require('../config/firebaseConfig');

exports.updateProfile = async (req, res) => {
  const { vendorId } = req.params; // Get vendorId from the route parameter
  const profileData = req.body; // Get profile data from the request body

  try {
    // Assuming you have a single profile document per vendor
    const profileRef = db.collection('vendors').doc(vendorId);
    await profileRef.set(profileData, { merge: true });

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};
