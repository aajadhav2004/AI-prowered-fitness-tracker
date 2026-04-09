import User from '../models/User.js';

const verifyAdmin = async (req, res, next) => {
  try {
    console.log('=== verifyAdmin middleware ===');
    console.log('User ID from token:', req.user.id);
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('User found:', user.name, 'Role:', user.role);
    
    if (user.role !== 'admin') {
      console.log('Access denied - user is not admin');
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    console.log('Admin verified successfully');
    next();
  } catch (err) {
    console.error('Admin verification error:', err);
    res.status(500).json({ error: 'Authorization failed' });
  }
};

export default verifyAdmin;
