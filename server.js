require("dotenv").config()

const express = require("express")
const app = express()
const mongoose = require("mongoose")

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("Connected to DB"))

app.use(express.json())
const subscribersRouter = require("./routes/inventories")
app.use("/inventories", subscribersRouter)
// localhost:3000/inventories

app.listen(3000, () => console.log("Server Started"))