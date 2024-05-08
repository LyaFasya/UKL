const express = require(`express`)
const app = express()

const order_listController = require(`../controllers/order_list.controller`)
const auth = require(`../controllers/auth.controller`)
app.use(express.json())

// app.get("/", order_listController.getAllfood)
// app.get("/:id", order_listController.getFoodbyid)
app.post("/", order_listController.addorder_list)
app.get("/",auth.authorize, order_listController.getOrderHistory)
// app.post("/find", order_listController.findFood)
module.exports = app