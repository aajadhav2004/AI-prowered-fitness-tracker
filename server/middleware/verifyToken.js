import jwt from 'jsonwebtoken';

export default function verifyToken(req, res, next) {
  const auth = req.headers['authorization'] || req.headers['x-access-token'];
  const token = auth && auth.split ? auth.split(' ')[1] : auth;

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  } 
}
