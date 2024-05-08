/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()
app.use(express.json())
const adminController = require(`../controllers/admin.controller`)
/** create route to get data with method "GET" */
app.get("/", adminController.getAllAdmin)
app.get('/admin/login', adminController.loginAdmin);

module.exports = app