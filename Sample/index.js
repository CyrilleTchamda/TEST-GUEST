const express = require('express')
const cors = require('cors')


const app = express()

// middleware

app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ['https://admin.ear-gt.com','https://ear-gt.com','http://localhost:3000'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
}));





//static Images Folder
app.use('/Images', express.static('./Images'))



// routers


// Categorie
const routerCategorie = require('./routes/categorie.routes')
app.use('/api/categorie', routerCategorie)

// Actu
const routerActu = require('./routes/actu.routes')
app.use('/api/actu', routerActu)

// User
const routerUser = require('./routes/user.routes')
app.use('/api/user', routerUser)





//port

const PORT = process.env.PORT || 8080

//server

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})