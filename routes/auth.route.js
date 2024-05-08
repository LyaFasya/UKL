/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()

/** allow to read 'request' with json type */
app.use(express.json())

/** load function authentcation from auth's controller */
const authController= require(`../controllers/auth.controller`)

/** create route for authentication */
app.post("/", authController.authenticate)

/** export app in order to load in another file */
module.exports = app