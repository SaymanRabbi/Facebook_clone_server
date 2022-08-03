const User = require("../Models/User")

exports.validationEmail = (email) => {
    return String(email).toLowerCase().match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/)
}
exports.validationLength = (text, min, max) => {
    if(text.length>max || text.length<min){
        return false
    }
    else {
        return true
    }
}
exports.userNameValidation =async(username) => {
    let a = false;
    do {
        let check = await User.findOne({ username })
        if (check) {
            //changes user name
            username+= (+ new Date() * Math.random()).toString().substring(0,1)
            a = true;
        } else {
            a = false;
        }
    } while (a);
    return username;
}