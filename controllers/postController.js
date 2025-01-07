const Post = require('../models/postModel')
const catchAsync = require('../utils/catchAsync');




exports.getAllPosts = async(req, res) => {
    try {
        const posts = await Post.find().populate('comments').populate('user');
        res.status(200).json({
            "status": "success",
            "results": posts.length,
            "data": {
                "posts": posts
            }
        })
    } catch (error) {
        res.status(404).json({
            "status": "fail",
            "message": error
        })
    }
}

exports.createPost = async (req, res) => {
   try {
    const postData = {
        ...req.body,
        user: req.user.id,
        author: req.user.name
    }
    const post = await Post.create({...postData, date_posted: Date.now().toString()});
    res.status(201).json({
        "status": "success",
        "data": {
            "post": post
        }
    })
   }catch (error) {
    res.status(400).json({
        "status": "fail",
        "message": error
    })
   }
}

exports.getOnePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json({
            "status": "success",
            "data": {
                "post": post
            }
        })
    }
    catch(error) {
        res.status(404).json({
            "status": "fail",
            "message": error
        })
    }
}

exports.updatePost = async(req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            "status": "success",
            "data": {
                "post": post
            }
        })
    }
    catch(error) {
        res.status(404).json({
            "status": "fail",
            "message": error
        })
    }
}

exports.deletePost = async(req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        res.status(204).json({
            "status": "success",
            "data": null
        })
    } 
    catch (error) {
        res.status(404).json({
            "status": "fail",
            "message": error
        })
    }
}

exports.AddLike = async(req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {$inc: {likes: 1}}, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            "status": "success",
            "data": {
                "post": post
            }
        })
    } catch (error) {
        res.status(404).json({
            "status": "fail",
            "message": error
        })
    }
}

exports.createComment = async(req, res) => {
    try {
        const post = await Post.updateOne({_id: req.params.id}, {$push: {comments: req.body}});
        res.status(200).json({
            "status": "success",
            "data": {
                "post": post
            }
        })
    } catch (error) {
        res.status(404).json({
            "status": "fail",
            "message": error
        })
    }
}