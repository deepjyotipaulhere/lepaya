var app = require('./app')
var request = require('supertest')
var sqlite = require("sqlite3")

describe("GET:  /", () => {
    test("Is Server up and running", (done) => {
        request(app).get("/").then(response => {
            expect(response.status).toBe(200);
            done()
        })
    })
})

describe("POST: /getcards", () => {
    test("Is random number cards generated", (done) => {
        request(app).post("/getcards").send({
            size: 4
        }).then(response => {
            expect(response.status).toBe(200);
            done()
        })
    })
    test("Is random numbers length is as expected", (done) => {
        request(app).post("/getcards").send({
            size: 8
        }).then(response => {
            expect(response.body.length).toEqual(8)
            done()
        })
    })
    test("Are all random numbers unique", (done) => {
        request(app).post("/getcards").send({
            size: 12
        }).then(response => {
            var isUnique=(new Set(response.body)).size === response.body.length;
            expect(isUnique).toBeTruthy()
            done()
        })
    })
})

const gameid = Math.ceil(Math.random() * 1000)

describe("POST: /save", () => {
    test("Is card moves getting saved", (done) => {
        request(app).post("/save").send({
            move: [23, 25, 27, 78],
            gameid: gameid,
            status: true
        }).then(response => {
            expect(response.body.status).toBeTruthy();
            done()
        })
    })
})

describe("GET:  /moves", () => {
    test("Is moves list being returned", (done) => {
        request(app).get("/moves").then(response => {
            expect(response.body[gameid].length).toBe(4);
            done()
        })
    })
})

describe("POST: /cleardb",()=>{
    test("DB getting cleared", done=>{
        request(app).post("/cleardb").then(response=>{
            expect(response.body.length).toEqual(0)
            done()
        })
    })
})