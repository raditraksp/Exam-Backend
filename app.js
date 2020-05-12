const express = require('express')
const app = express()
const port = 2000

// import route
const productRouter = require('./src/routes/productRoute')
const storeRouter = require('./src/routes/storeRoute')
const uiRouter = require('./src/routes/uiRoute')

app.use(express.json())
app.use(productRouter)
app.use(storeRouter)
app.use(uiRouter)

app.get('/', (req, res) => {
    res.send( 
        '<h1> API IS CONNECTED </h1>'
    )
})


app.listen(port, () => console.log('API IS RUNNING'))