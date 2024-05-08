const express = require(`express`)
const app = express()

const foodController = require(`../controllers/food.controller`)
const auth = require(`../controllers/auth.controller`)

app.use(express.json())

app.get("/", foodController.getAllfood)
app.get("/:keyword", foodController.findFood)
app.post("/",auth.authorize, foodController.addfood)
app.post("/find", foodController.findFood)
app.put("/:id", auth.authorize, foodController.updatefood)
app.delete("/:id", auth.authorize, foodController.deletefood)

module.exports = app