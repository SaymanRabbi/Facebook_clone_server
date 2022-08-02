const express = require('express')
const cors = require('cors')
//dotenv
const dotenv = require('dotenv')
const {readdirSync} = require('fs')
const app = express()
//port
const port = process.env.PORT || 4000
//config
dotenv.config()
//cors
app.use(cors())
//Dynamic routes
readdirSync("./routes").map(r => app.use("/", require("./routes/" + r)));

//server Listening
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})