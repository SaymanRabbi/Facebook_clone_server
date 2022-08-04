const { validationEmail, validationLength, userNameValidation } = require('../helpers/validation')
const bcrypt = require('bcrypt')
const User = require('../Models/User')
const { genaretCode } = require('../helpers/token')
const { sendVerifactionEmail } = require('../helpers/mailer')
exports.register = async (req, res) => {
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
                messages: "Unvalid Email Address"
            })
        }
        const check = await User?.findOne({ email })
        if (check) {
            return res.status(400).json({
                messages: "This email is already Exists Try Another One"
            })
        }
        //first name validation
        if (!validationLength(first_name, 3, 30)) {
            return res.status(400).json({
                messages: "First Name Must Be Between 3 And 30 Characters"
            })
        }
        //last name validation
        if (!validationLength(last_name, 3, 30)) {
            return res.status(400).json({
                messages: "Last Name Must Be Between 3 And 30 Characters"
            })
        }
        //password validation
        if (!validationLength(password, 6, 30)) {
            return res.status(400).json({
                messages: "Password Must Be 6 Characters"
            })
        }
        const cryptedPassword = await bcrypt.hash(password, 12)
        let userName = first_name + last_name;
        //user name validation
        let newUserName = await userNameValidation(userName);
        const user = await new User({
            first_name,
            last_name,
            username: newUserName,
            email,
            password: cryptedPassword,
            bYear,
            bMonth,
            bDay,
            gender
        }).save()
        //emailverification
        const emailvarificationToken = genaretCode({ id: user._id.toString() }, '30m')
        const url = `${process.env.BASE_URL}/activate/${emailvarificationToken}`
        sendVerifactionEmail(user?.email, user?.first_name, url)
        const token = genaretCode({ id: user._id.toString() }, '7d')
        res.send({
            id: user._id,
            usrname: user?.username,
            picture: user?.picture,
            first_name: user?.first_name,
            last_name: user?.last_name,
            token: token,
            verified: user?.verified,
            messages: "User Created Successfully Please Check Your Email To Activate Your Account"
        })
    } catch (error) {
        res.status(500).json({ messages: error?.messages })
    }
};
exports.activateAccount = async (req, res) => {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const check = await User.findById(user.id);
    if (check.verified == true) {
      return res.status(400).json({ message: "this email is already activated" });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res
        .status(200)
        .json({ message: "Account has beeen activated successfully." });
    }
  };