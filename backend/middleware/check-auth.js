const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'secret_password');
        req.userData = {email: decodedToken.email, userId:decodedToken.userId};
        // console.log(decodedToken);
        next();
    } catch (error) {
        res.status(401).json({ message: 'not logged' });
    }

}