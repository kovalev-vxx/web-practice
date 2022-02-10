const express = require('express');
const cors = require('cors');
const events = require('events');

const PORT = 3000;

const emitter = new events.EventEmitter()

const app = express()

app.use(cors)

app.get('get-message', (res, req)=>{
    emitter.once('newMessage',(message)=>{
        res.json(message)
    })
})


app.post("new-message", (res,req)=>{
    const message = req.body;
    emitter.emit('newMessage', message)
    res.status(200)
})


app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`))

