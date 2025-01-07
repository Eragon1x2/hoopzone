const User = require('../models/userModel');




exports.getOneUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('posts');
        res.status(200).json({
            "status": "success",
            "data": {
                "user": user
            }
        })
    } catch (error) {
        res.status(404).json({
            "status": "fail",
            "message": error
        })
    }
}