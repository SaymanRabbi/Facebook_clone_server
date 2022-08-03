const { validationEmail } = require('../helpers/validation')
const User = require('../Models/User')
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
     return  
    const user = await new User({
        first_name,
        last_name,
        username,
        email,
        password,
        bYear,
        bMonth,
        bDay,
        gender
    }).save()
    res.json(user)
   } catch (error) {
    res.status(500).json({messages:error?.messages})
   }
}