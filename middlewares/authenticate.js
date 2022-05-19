const jwt = require('jsonwebtoken');
const Role = require('helpers/role');

TOKEN_SECRET = "&o,hT1*<$@E9IRtix?^9zAmo3aYE;0v[XJFq>m/-Ju(=P.)Fu~>^kPxq)AL2Zg";

// users hardcoded for simplicity, store in a db for production applications
const users = [
    { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
    { id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.Student }
];

async function userAuthenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ sub: user.id, role: user.role }, TOKEN_SECRET);
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
}

module.exports = {
    userAuthenticate,
};