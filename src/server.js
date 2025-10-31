const express = require('express')
const path = require('path')
const connectMongoAtlas = require('./config/db')

const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads/hls', express.static(path.join(__dirname, 'uploads', 'hls')));
app.use(express.json())
app.use(express.json({extended: false}))

connectMongoAtlas()

app.use('/media', require('./routes/media.routes'))
app.use('/category', require('./routes/category.routes'))

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})