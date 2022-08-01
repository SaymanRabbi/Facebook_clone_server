const express = require('express')
const app = express()
const port = 4000
const cors = require('cors')
const option = {
    origin: 'http://localhost:3000',
}
app.use(cors(option))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})