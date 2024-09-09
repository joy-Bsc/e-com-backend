const CartModel = require('../models/CartModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const CartListService = async (req) => {
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

    let data = await CartModel.aggregate([MatchStage, JoinWithProductStage, UnwindProductStage, JoinWithBrandStage, UnwindBrandStage, JoinWithCategoryStage, UnwindCategoryStage, ProjectionStage]);
    return {status: "success", data: data};

    }
    catch (error) {
        return {status: "fail", data: error};
}
}



const SaveCartListService = async (req) => {
    try {
        let user_id = req.headers.user_id;
    let reqBody = req.body;
    reqBody.userID = user_id;
    await CartModel.create(reqBody);
    return {status:"success",message:"Cart List create successfully"};

    } catch (error) {
        return {status:"fail",message:error.toString()};
    }
}

const UpdateCartListService = async (req) => {
    try {
        let user_id = req.headers.user_id;
        let cartID = req.params.cartID;
        let reqBody = req.body;

        await CartModel.updateOne({_id:cartID, userID:user_id}, {$set:reqBody});
        return {status:"success",message:"Cart List updated successfully"};
    } catch (error) {
        return {status:"fail",message:error.toString()};
        
    }
}

const RemoveCartListService = async (req) => {
    try {
        let user_id = req.headers.user_id;
        let reqBody = req.body;
        reqBody.userID = user_id;
        await CartModel.deleteOne(reqBody);
        return {status:"success",message:"Cart List removed successfully"};
    } catch (error) {
        return {status:"fail",message:error.toString()};
    }
}

module.exports = {
    CartListService,
    SaveCartListService,
    UpdateCartListService,
    RemoveCartListService
}
