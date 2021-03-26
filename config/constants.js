const userAuthorization = {
    Admin: 1,
    User: 2
};
  
const userRoleType = {
    1: 'Admin',
    2: 'User'
};

const myprivatekey = "secretkey";
const tokenLife = 500000;

module.exports = {
    userAuthorization,
    userRoleType,
    myprivatekey,
    tokenLife
}
