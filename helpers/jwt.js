const jwt = require('jsonwebtoken');
require('./dotenv');

function authorize(roles = []) {
    return function (req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
    
        if (token == null) return res.sendStatus(401);
        
        // roles param can be a single role string (e.g. Role.User or 'User') 
        // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
        if (typeof roles === 'string') {
            roles = [roles];
        }

        const { email, role } = jwt.verify(token, process.env.SECRET);

        if (!roles.includes(role)) {
            return res.status(401).send({ message: 'You are not authorized to access this resource' });
        } else {
            req.user = { email, role };
            next();
        }
    }
}

module.exports = authorize;