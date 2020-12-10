require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const { Client } = require('pg')

const client = new Client()
client.connect()
client.query('SELECT NOW() as now', (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res.rows[0])
    }
  })

const app = express()
app.use(bodyParser.json({
  type: ['application/json', 'text/plain']
}));

app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.send(`<h1>LOGIN</h1>`)
})

//app.get('/signup', (req, res) => {
//    res.send("<h1>SIGNUP</h1>")
//})

doExists("yoyo@gmail.com")

function doExists(q) {
    client.query("SELECT * FROM u_p WHERE email = $1", [q], (err, res) => {
    if (err) {
        console.log(err.stack)
    } else if(res.rows.length) {
        return false
    } else {
        return true
    }
    })
}

app.post('/signup', (req, res) => {
    console.log(req.body)
    const query = {
        text: 'INSERT INTO u_p(name, email, passwd) VALUES($1, $2, $3) RETURNING *',
        values: [req.body.name, req.body.email, req.body.passwd],
    }
    
    client.query(query, (err, res) => {
    if (err) {
        console.log(err.stack)
    } else {
        console.log(res.rows[0])
    }
    })
    // promise
    //client
    //.query(query)
    //.then(res => console.log(res.rows[0]))
    //.catch(e => console.error(e.stack))
    res.sendStatus(200)
})

app.listen(3000)