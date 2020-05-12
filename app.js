const express = require('express')
const app = express()
const port = 2000

// import route
const heroesRouter = require('./src/routes/heroesRouter')

app.use(express.json())
app.use(heroesRouter)

app.get('/', (req, res) => {
    res.send( 
        '<h1> API IS CONNECTED </h1>'
    )
})


app.listen(port, () => console.log('API IS RUNNING'))