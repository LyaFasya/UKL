const order_listModel = require(`../models/index`).order_list
const order_detailModel = require(`../models/index`).order_detail

exports.addorder_list = async (req, res) => {
    try {
        const { customer_name, table_number, order_date, order_detail } = req.body;

        // Buat pesanan baru
        const newOrder = await order_listModel.create({
            customer_name,
            table_number,
            order_date
        });

        // Simpan detail pesanan
        for (const detail of order_detail) {
            await order_detailModel.create({
                order_id: newOrder.id,
                food_id: detail.food_id,
                price: detail.price,
                quantity: detail.quantity
            });
        }

        // Tampilkan respons
        return res.json({
            status: true,
            data: newOrder,
            message: 'Order list has created'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Failed to create order'
        });
    }
};


exports.getOrderHistory = async (req, res) => {
    try {
        const orders = await order_listModel.findAll({
            include: [{ model: order_detailModel,as:"order_detail"}]
        });

        return res.status(200).json({
            status: true,
            data: orders,
            message: 'Order list has retrieved'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Failed to retrieve order list'
        });
    }
};

// exports.getOrder = async (req, res) => {
// const orders = await order_listModel.findAll();

// 		const ordersWithDetails = [];

// 		for (const order of orders) {
// 			const order_detail = await order_detailModel.findAll({
// 				where: { id: order.id },
// 			});

// 			ordersWithDetails.push({
// 				order: order,
// 				order_detail: order_detail,
// 			});
// 		}

// 		return res.status(200).json({
// 			status: true,
// 			data: orders,
// 			message: "Order list has retrieved",
// 		});
//     }

// exports.getOrder = async (request, response) => {
//     try {
//       // Fetch order lists with associated order details
//       const orderLists = await orderLists.findAll({
//         include: [
//           {
//             model: order_detail,
//             as: "orderID",
//           },
//         ],
//       });
  
//       return response.status(200).json({
//         status: true,
//         data: orderLists,
//         message: "Order list has been retrieved",
//       });
//     } catch (error) {
//       console.error(error);
//       return response
//         .status(500)
//         .json({ status: false, message: "Internal server error" });
//     }
//   };

// exports.getAllfood = async (request, response) => {
//     let food = await foodModel.findAll()
//     return response.json({
//         success: true,
//         data: food,
//         message: `Food has retrieved`
//     })
// }
