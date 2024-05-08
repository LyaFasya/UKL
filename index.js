/** load library express */
const express = require(`express`)
const adminRoute = require('./routes/admin.route');
const auth = require("./routes/auth.route");
const food = require("./routes/food.route");
const order = require("./routes/order_list.route");

/** create object that instances of express */
const app = express()

/** define port of server */
const PORT = 2000

/** load library cors */
const cors = require(`cors`)

/** open CORS policy */
app.use(cors())


/** define prefix for each route */
app.use(`/admin`, adminRoute)
app.use("/admin/auth",auth)
app.use("/food",food)
app.use("/order",order)


/** run server based on defined port */
app.listen(PORT, () => {
 console.log(`Server of Food Ordering runs on port ${PORT}`)
})