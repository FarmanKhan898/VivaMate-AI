import jwt from 'jsonwebtoken';

export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET || 'vivamate-super-secret-key',
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET || 'vivamate-super-secret-key');
}
