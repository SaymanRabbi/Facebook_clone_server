const express = require('express')
//cors
const cors = require('cors')
//mongoose
const mongoose = require('mongoose')
//dotenv
const dotenv = require('dotenv')
const { readdirSync } = require('fs')
//app
const app = express()
//port
const port = process.env.PORT || 4000
//config
dotenv.config()
//cors
app.use(cors())
//Dynamic routes
readdirSync("./routes").map(r => app.use("/", require("./routes/" + r)));
//DataBase  
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Database connected Successfully');
}).catch(err => console.log(err.messages))
//server Listening
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})