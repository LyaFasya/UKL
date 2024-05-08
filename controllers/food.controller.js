const foodModel = require(`../models/index`).food
const Op = require(`sequelize`).Op
const path = require(`path`)
const fs = require(`fs`)
const { log } = require('console')
const upload = require('./upload-food').single(`image`)


exports.getAllfood = async (request, response) => {
    let food = await foodModel.findAll()
    return response.json({
        success: true,
        data: food,
        message: `Food has retrieved`
    })
}

exports.getFoodbyid = async (request, response) => {
    /** call findAll() to get all data */
    
      let id = request.params.id;
      let food = await foodModel.findOne({
        where: {
          id: id,
        },
      });
      return response.json({
        success: true,
        data: food,
        message: `Food has retrieved`,
      });
    
  };

exports.findFood = async (request, response) => {
    let keyword = request.params.keyword
    let food = await foodModel.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.substring]: keyword } },
                { spicy_level: { [Op.substring]: keyword } },
                { price: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({ 
        success: true,
        data: food,
        message: `Food has retrieved`
    })
}

exports.addfood = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }
        if (!request.file) {
            return response.json({ message: `Nothing to upload` })
        }

        let newfood = {
            name: request.body.name,
            spicy_level: request.body.spicy_level,
            price: request.body.price,
            image: request.file.filename,
        }
        console.log(newfood)
        foodModel.create(newfood)
        .then(result => {
            return response.json({
                success: true,
                data: result,
                message: `Food has created`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
    })
    
}

exports.updatefood = async (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ success: false, message: error });
        }
        let id = request.params.id;
        let food = {
            name: request.body.name,
            spicy_level: request.body.spicy_level,
            price: request.body.price,
            image: request.file ? request.file.filename : null // Gunakan null jika tidak ada file baru di-upload
        }

        // Jika ada file baru di-upload, hapus gambar lama
        if (request.file) {
            const selectedfood = await foodModel.findOne({
                where: { id: id }
            });
            const oldfoodPhoto = selectedfood.image;
            console.log(oldfoodPhoto);
            const pathImage = path.join(__dirname, `../image`, oldfoodPhoto);
            if (fs.existsSync(pathImage)) {
                fs.unlink(pathImage, error => console.log(error));
            }
        }

        // Lakukan pembaruan data makanan
        foodModel.update(food, { where: { id: id } })
            .then(result => {
                // Ambil data makanan yang telah diupdate
                foodModel.findByPk(id)
                    .then(updatedFood => {
                        return response.json({
                            success: true,
                            data: updatedFood,
                            message: `Food has updated`
                        });
                    })
                    .catch(error => {
                        console.error(error);
                        return response.status(500).json({
                            success: false,
                            message: 'Failed to retrieve updated food data'
                        });
                    });
            })
            .catch(error => {
                console.error(error);
                return response.status(500).json({
                    success: false,
                    message: 'Failed to update food'
                });
            });
    });
};

exports.deletefood = async (request, response) => {
    const id = request.params.id;
    
    try {
        // Temukan makanan berdasarkan ID sebelum dihapus
        const foodToDelete = await foodModel.findOne({ where: { id: id } });

        if (!foodToDelete) {
            return response.status(404).json({
                success: false,
                message: 'Food not found'
            });
        }

        // Hapus gambar makanan
        const pathImage = path.join(__dirname, '../food', foodToDelete.image);
        if (fs.existsSync(pathImage)) {
            fs.unlink(pathImage, error => console.log(error));
        }

        // Hapus makanan dari database
        await foodModel.destroy({ where: { id: id } });

        // Respon dengan data makanan yang dihapus
        return response.json({
            success: true,
            data: foodToDelete,
            message: 'Data has been deleted'
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
};
