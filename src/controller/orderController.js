const { db } = require('../config/firebaseConfig');

exports.viewOrders = async (req, res) => {
  const { vendorId } = req.query;

  if (!vendorId) {
    return res.status(400).json({ message: 'vendorId is required' });
  }

  try {
    const ordersSnapshot = await db.collection('orders')
      .where('vendorId', '==', vendorId).get();

    if (ordersSnapshot.empty) {
      return res.status(404).json({ message: 'No orders found' });
    }

    const ordersList = ordersSnapshot.docs.map(doc => doc.data());
    res.status(200).json(ordersList);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders', error: error.message });
  }
};

exports.manageOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await orderRef.update({ status });
    res.status(200).json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};
