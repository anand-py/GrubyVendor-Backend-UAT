// const admin = require('../../firebase/firebaseAdmin');

// const authenticate = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).send('Unauthorized');
//   }
//   try {
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     req.user = decodedToken;
//     next();
//   } catch (error) {
//     res.status(401).send('Unauthorized');
//   }
// };

// module.exports = {
//   authenticate,
// };
