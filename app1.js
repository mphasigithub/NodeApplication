const express = require('express');
const app = express()
const jwt = require('jsonwebtoken');

// Generate a new refresh token
function generateRefreshToken(user) {
    const payload = {
      id: user.id,
      email: user.email
    };
  
    const secret = 'your-refresh-token-secret';
    const options = { expiresIn: '7d' };
  
    return jwt.sign(payload, secret, options);
  }
  
  // Verify a refresh token
  function verifyRefreshToken(token) {
    const secret = 'your-refresh-token-secret';
  
    try {
      const decoded = jwt.verify(token, secret);
      return { success: true, data: decoded };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  app.get('/', (req, res) => {
    res.send('Hello, codedamn!');
  });
  
  // Refresh an access token using a valid refresh token
  app.post('/token/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
  
    if (!refreshToken) {
      return res.sendStatus(401);
    }
  
    const result = verifyRefreshToken(refreshToken);
  
    if (!result.success) {
      return res.status(403).json({ error: result.error });
    }
  
    const user = result.data;
    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  });