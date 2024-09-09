const  mongoose  = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const WishModel = require('../models/WishModel');
const WishListService = async (req) => {
    try {
        let user_id = new ObjectId(req.headers.user_id);
    let MatchStage = {$match: {userID: user_id}};
    let JoinWithProductStage = {$lookup: {from: "products", localField: "productID", foreignField: "_id", as: "product"}};
    let UnwindProductStage = {$unwind: "$product"};

    let JoinWithBrandStage = {$lookup: {from: "brands", localField: "product.brandID", foreignField: "_id", as: "brand"}};
    let UnwindBrandStage = {$unwind: "$brand"};

    let JoinWithCategoryStage = {$lookup: {from: "categories", localField: "product.categoryID", foreignField: "_id", as: "category"}};
    let UnwindCategoryStage = {$unwind: "$category"};

     let ProjectionStage = {
        $project: {
            '_id': 0,
            'userID': 0,
            'createdAt': 0,
            'updatedAt': 0,
            'product._id': 0,
            'product.brandID': 0,
            'product.categoryID': 0,
            'product.createdAt': 0,
            'product.updatedAt': 0,
            'product.__v': 0,
            'brand._id': 0,
            'brand.createdAt': 0,
            'brand.updatedAt': 0,
            'brand.__v': 0,
            'category._id': 0,
            'category.createdAt': 0,
            'category.updatedAt': 0,
            'category.__v': 0
        }
     };

    let data = await WishModel.aggregate([MatchStage, JoinWithProductStage, UnwindProductStage, JoinWithBrandStage, UnwindBrandStage, JoinWithCategoryStage, UnwindCategoryStage, ProjectionStage]);
    return {status: "success", data: data};

    }
    catch (error) {
        return {status: "fail", data: error};
}
}

const SaveWishListService = async (req) => {
    try {
        let user_id = req.headers.user_id;
    let reqBody = req.body;
    reqBody.userID = user_id;

    await WishModel.updateOne(reqBody, {$set:reqBody}, {upsert: true});
    return {status:"success",message:"Wish List saved successfully"};
    } catch (error) {
        return {status:"fail",message:error.toString()};
    }
}

const RemoveWishListService = async (req) => {
    try {
        let user_id = req.headers.user_id;
    let reqBody = req.body;
    reqBody.userID = user_id;

    await WishModel.deleteOne(reqBody);
    return {status:"success",message:"Wish List delete successfully"};
    } catch (error) {
        return {status:"fail",message:error.toString()};
    }
}

module.exports = { WishListService, SaveWishListService, RemoveWishListService }
