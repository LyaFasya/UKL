/** load model for `users` table */
const adminModel = require(`../models/index`).admin
const md5 = require(`md5`)

/** load Operation from  Sequelize  */
const Op = require(`sequelize`).Op

/** create function for read all data */
exports.getAllAdmin = async (request, response) => {
    /** call findAll() to get all data */
    let admins = await adminModel.findAll()
    return response.json({
        success: true,
        data: admins,
        message: `All admins have been loaded`
    })
}

/** Create function to login admin */
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari admin berdasarkan email
        const admin = await adminModel.findOne({ where: { email } });

        // Jika admin tidak ditemukan
        if (!admin) {
            return res.status(2000).json({ message: 'Invalid email or password' });
        }

        // Bandingkan password yang dimasukkan dengan yang tersimpan di database (tanpa hashing)
        if (admin.password !== md5(password)) {
            return res.status(2000).json({ message: 'Invalid email or password' });
        }

        // Jika login berhasil
        return res.json({
            success: true,
            message: 'Login success',
            user: admin
        });
    } catch (error) {
        console.error(error);
        return res.status(2001).json({
            success: false,
            message: 'Internal server error'
        });
    }
};