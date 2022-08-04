const { validationEmail, validationLength, userNameValidation } = require('../helpers/validation')
const bcrypt = require('bcrypt')
const User = require('../Models/User')
const { genaretCode } = require('../helpers/token')
exports.register = async(req, res) => {
   try {
    const {
        first_name,
        last_name,
        username,
        email,
        password,
        bYear,
        bMonth,
        bDay,
        gender
       } = req.body
//email validation
if (!validationEmail(email)) {
           return res.status(400).json({
               messages:"Unvalid Email Address"
           })
       }
const check = await User?.findOne({ email })
       if (check) {
        return res.status(400).json({
        messages:"This email is already Exists Try Another One" 
        })
       } 
       //first name validation
       if (!validationLength(first_name,3,30)) {
        return res.status(400).json({
            messages:"First Name Must Be Between 3 And 30 Characters" 
            })
       }
       //last name validation
       if (!validationLength(last_name,3,30)) {
        return res.status(400).json({
            messages:"Last Name Must Be Between 3 And 30 Characters" 
            })
       }
       //password validation
       if (!validationLength(password,6,30)) {
        return res.status(400).json({
            messages:"Password Must Be 6 Characters" 
            })
       }
       const cryptedPassword = await bcrypt.hash(password, 12)
       let userName = first_name + last_name;
       //user name validation
       let newUserName = await userNameValidation(userName);
    const user = await new User({
        first_name,
        last_name,
        username:newUserName,
        email,
        password:cryptedPassword,
        bYear,
        bMonth,
        bDay,
        gender
    }).save()
       const emailvarificationToken = genaretCode({ id: user._id.toString() }, '30m')
      
    res.json(user)
   } catch (error) {
    res.status(500).json({messages:error?.messages})
   }
}