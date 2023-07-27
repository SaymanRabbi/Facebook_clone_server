const jwt = require('jsonwebtoken');

exports.authUser = async (req, res, next) => {
//   console.log("authUser");
    try {
        const temp = req.header('Authorization');
        const token = temp ? temp.slice(7, temp?.length) : "";
        if(!token) {
            return res.status(401).json({
                messages: "Auth Failed"
            })
        }
        jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
            if(err) {
                return res.status(401).json({
                    messages: "Auth Failed"
                })
            }
            req.user = decoded;
            next();
        } );

    } catch (error) {
        res.status(500).json({ messages: error?.messages })    
    }
 }