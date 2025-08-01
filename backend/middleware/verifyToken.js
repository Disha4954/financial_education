import admin from '../services/firebase.js';
import jwt from 'jsonwebtoken';

export default async function verifyToken(req, res, next) {
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = await admin.auth().verifyIdToken(auth);
    req.uid = decoded.uid;
    next();
  } catch {
    try {
      const payload = jwt.verify(auth, process.env.JWT_SECRET);
      req.uid = payload.uid;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid auth token' });
    }
  }
}
