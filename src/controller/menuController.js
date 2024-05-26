const { db } = require('../config/firebaseConfig');

exports.manageMenu = async (req, res) => {
  const {
    isOpen,
    items,
    openDetails,
    restaurantImageUrl,
    restaurantLocation,
    restaurantName,
    vendorFcmToken,
    vendorId
  } = req.body;

  try {
    // Ensure all required fields are defined
    if (
      typeof isOpen === 'undefined' ||
      typeof items === 'undefined' ||
      typeof openDetails === 'undefined' ||
      typeof restaurantImageUrl === 'undefined' ||
      typeof restaurantLocation === 'undefined' ||
      typeof restaurantName === 'undefined' ||
      typeof vendorFcmToken === 'undefined' ||
      typeof vendorId === 'undefined'
    ) {
      throw new Error('Missing required fields');
    }

    // Structure the data for Firestore
    const menuData = {
      isOpen,
      items,
      openDetails,
      restaurantImageUrl,
      restaurantLocation,
      restaurantName,
      vendorFcmToken,
      vendorId
    };

    // Save the menu data in Firestore
    const menuRef = db.collection('menus').doc(vendorId);
    await menuRef.set(menuData);

    res.status(200).json({ message:  `Menu data added/updated successfully` });
  } catch (error) {
    res.status(500).json({
      message: 'Error managing menu data',
      error: error.message
    });
  }
};
