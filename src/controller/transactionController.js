const { db } = require('../config/firebaseConfig');

exports.viewTransactionHistory = async (req, res) => {
  const vendorId = req.query.vendorId; // Read vendor ID from query parameter

  if (!vendorId) {
    return res.status(400).json({ message: 'Vendor ID is required' });
  }

  try {
    const transactionsSnapshot = await db.collection('transactions')
      .where('vendorId', '==', vendorId).get();

    if (transactionsSnapshot.empty) {
      return res.status(200).json({ message: 'No transactions found', totalSales: 0, totalOrders: 0, totalEarnings: 0 });
    }

    let totalSales = 0;
    let totalOrders = 0;
    let totalEarnings = 0;
    const transactions = [];

    transactionsSnapshot.forEach(doc => {
      const data = doc.data();
      transactions.push(data);
      totalSales += data.totalPrice;
      totalOrders += 1;
      totalEarnings += data.totalPrice; // Assuming totalPrice is the earnings for each order
    });

    res.status(200).json({ 
      message: 'Transaction history retrieved successfully', 
      totalSales, 
      totalOrders, 
      totalEarnings,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving transaction history', error: error.message });
  }
};
