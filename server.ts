const {initSocket} = require("./server/socket");
const {initAPI} = require("./server/api");
const {initDatabase} = require("./server/database/database");

const { Server } = require('socket.io')
const path = require('path')
const cors = require('cors')

const express = require('express')
const app = express()

app.use(express.json())
app.use(cors())

const http = require('http')
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost',
        methods: ['GET', 'POST']
    }}
)

const port = process.env.PORT || 4000
server.listen(port)

require('dotenv').config()

initAPI(app)
// initSocket(io)
// initDatabase()

app.use('/', express.static(path.join(__dirname, 'dist')))

console.log('Port: ' + port)