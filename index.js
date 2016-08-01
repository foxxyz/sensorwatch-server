var WebSocketServer = require("ws").Server
var MongoClient = require('mongodb').MongoClient
var http = require("http")
var express = require("express")
var bodyParser = require("body-parser")
var app = express()
var port = process.env.PORT || 5000

// Set up DB
var url = 'mongodb://localhost:27017/test';
var DB = null
MongoClient.connect(url, function(err, db) {
    if (err) {
        console.error("Error connecting to DB: " + err)
        return
    }
    console.info("Successfully connected to DB")
    DB = db
})

// Set up express server
var server = http.createServer(app)
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// Accept GET requests on /
app.get('/', (req, res) => {
    // One hour ago
    var since = new Date(new Date() - 7200 * 1000)
    var cursor = DB.collection('sensors').find({ timestamp: { $gt: since}})
    var results = []
    cursor.each((err, doc) => {
        if (!doc) {
            res.render('index', {results: JSON.stringify(results)})
            return
        }
        var docDate = new Date(doc.timestamp)
        Object.keys(doc.values).forEach((minute) => {
            Object.keys(doc.values[minute]).forEach((second) => {
                var resultDate = new Date(docDate.getTime() + parseInt(minute) * 60 * 1000 + parseInt(second) * 1000)
                results.push([resultDate.getTime(), doc.values[minute][second]])
            })
        })
    })
})

// Accept incoming POST requests on /update
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.post('/update/:secret/', (req, res) => {
    // Make sure secret token matches, otherwise ignore
    if (req.params.secret !== process.env['SENSORWATCH_SECRET']) {
        error404(req, res)
    }

    // Get current timestamp
    var now = new Date()
    var minute = now.getMinutes()
    now.setMinutes(0)
    var second = now.getSeconds()
    now.setSeconds(0)
    now.setMilliseconds(0)

    // Document time values to update
    var docID = req.body.id + ':' + now.valueOf()
    var doc = DB.collection('sensors').find({_id: docID}).limit(1).next()
        .then((doc) => {
            if (doc) DB.collection('sensors').update({_id: docID}, {$set: {["values." + minute + "." + second]: parseFloat(req.body.value)}})
            else DB.collection('sensors').insert({
                _id: docID,
                timestamp: now,
                id: req.body.id,
                unit: req.body.unit,
                values: {[minute]: {[second]: parseFloat(req.body.value)}}
            })
        })

    // Broadcast via websockets
    wss.broadcast(JSON.stringify(req.body))

    res.status(201).send('success')
})

// Everything else 404's
app.use(error404)
function error404(req, res, next) {
    res.status(404).send('Not found.')
}

// Set up websocket server
var wss = new WebSocketServer({server: server})
wss.on("connection", function(ws) {
    console.log("Websocket client connected")

    ws.on("close", function() {
        console.log("Connection closed")
    })
})

wss.broadcast = function(data) {
    wss.clients.forEach((client) => {
        client.send(data)
    })
}

// Start listening
server.listen(port, () => {
    console.log('SensorWatch Monitor started on ' + server.address().port)
})
