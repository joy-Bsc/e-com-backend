const jwt = require('jsonwebtoken');

const KEY = "123-ABC-XYZ"; // Moved outside to avoid repetition

exports.EncodeToken = (email, user_id) => {
    const EXPIRE = { expiresIn: '24h' };
    const PAYLOAD = { email, user_id }; // Simplified object assignment
    return jwt.sign(PAYLOAD, KEY, EXPIRE);
};

exports.DecodeToken = (token) => { // Removed unnecessary async/await
    try {
        return jwt.verify(token, KEY);
    } catch (error) {
        return { status: "fail", data: error.message }; // Changed to error.message for clearer error reporting
    }
};