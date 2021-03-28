var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var sqlite = require('sqlite3')
var _ = require('lodash')

var db = new sqlite.Database('db.sqlite')
db.serialize(() => {
    db.run("DROP TABLE moves")
    db.run("CREATE TABLE IF NOT EXISTS moves(value INTEGER,gameid INTEGER,status BOOLEAN,timestamp DATETIME DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW', 'localtime')))")
})


const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Server Up")
})

app.post("/getcards", (req, res) => {
    var { size } = req.body
    var rands = []
    for (let i = 0; ; i++) {
        const element = Math.ceil(Math.random() * 100)
        if (!rands.includes(element)) rands.push(element)
        if (rands.length == size) break
    }
    res.json(rands)
})

app.get("/moves", (req, res) => {
    db.all("SELECT * FROM moves ORDER BY timestamp", (err, rows) => {
        res.json(_.groupBy(rows, 'gameid'))
    })
})

app.post("/save", (req, res) => {
    var { move, gameid, status } = req.body
    var moves = move.map((xmove) => `(${xmove},${gameid},${status})`).join(',')
    db.run(`INSERT INTO moves(value,gameid,status) VALUES ` + moves, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        res.json({
            status: true
        })
    })

})

app.post("/cleardb",(req,res)=>{
    db.run("DELETE FROM moves",err=>{
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
    })
    db.run("SELECT * FROM moves",(err,rows)=>{
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        res.json(rows)
    })
})

module.exports=app;