const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async(senha) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(senha, salt);
    return hash;
};

helpers.matchPassword = async(senha, savedPassword) => {
    try {
        return await bcrypt.compare(senha, savedPassword).then(matches => {
            console.log('Maches', matches)
            if (matches == true) {
                return true
            }
        });;
    } catch (e) {
        console.log(e)
    }
};

module.exports = helpers;