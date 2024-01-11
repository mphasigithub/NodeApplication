const express = require('express');
const app = express()
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log("authHeader == ",authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log("token == ",token);

    if (!token) {
        //return res.sendStatus(401);
        return res.status(401).json({ error: "UnAuthorized by jaipal" });
    }

    const result = verifyAccessToken(token);

    if (!result.success) {
        return res.status(403).json({ error: result.error });
    }

    req.user = result.data;
    next();
}
const user = {id:"Jaipal-Singh",email:"jaipal.singh@gmail.com"};

app.get('/', (req, res) => {
    
    res.send(generateAccessToken(user));
});

app.get('/protected', authenticateToken, (req, res) => {
    
    res.json({ message: 'Welcome to the protected route!', user: req.user });
});



function generateAccessToken(user) {
    const payload = {
        id: user.id,
        email: user.email
    };

    const secret = 'your-secret-key';
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
}

function verifyAccessToken(token) {
    const secret = 'your-secret-key';

    try {
        const decoded = jwt.verify(token, secret);
        return { success: true, data: decoded };
    } catch (error) {
        return { success: false, error: "ERROR"+error.message };
    }
}

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});


