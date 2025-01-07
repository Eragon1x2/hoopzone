const Comment = require('../models/commentModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllComments = async(req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json({
            "status": "success",
            "data": {
                "comments": comments
            }
        })
    } catch (error) {
        res.status(404).json({
            "status": "fail",
            "message": error
        })
    }
}
exports.postComment = catchAsync(async(req, res) => {
    try {
        const commentDate = {
            ...req.body, 
            user: req.user.id,
            date_posted: new Date().toString(),
            
        }
        const comment = await Comment.create(commentDate);
        res.status(201).json({
            "status": "success",
            "data": {
                "comment": comment
            }
        })
    } catch (error) {
        res.status(400).json({
            "status": "fail",
            "message": error
        })
    }
})
exports.getOneComment = async(req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        res.status(200).json({
            "status": "success",
            "data": {
                "comment": comment
            }
        })
    } catch (error) {
        res.status(404).json({
            "status": "fail",
            "message": error
        })
    }
}