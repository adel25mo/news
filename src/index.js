const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const anocRouter = require('./routers/Announcer')
const reportRouter = require('./routers/report')
require('./db/mongoose')
app.use(express.json())
app.use(anocRouter)
app.use(reportRouter)


app.listen(port,()=>{console.log('Server is running')})