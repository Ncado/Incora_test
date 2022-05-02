require('dotenv').config()
const express = require('express')
const app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);

const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ extended: true }))
app.use('/api/user', require('./routes/userRoutes'))
app.set('socketio', io);
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()

       
          

  
        // io.on('connection', (socket) => {
        //     console.log('A USER CONNNNNNNNNECTEEEEED!!!');
        //   });
        
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    
      
    } catch (e) {
        console.log(e)
    }
}


start()