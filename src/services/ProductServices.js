const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const BrandModel = require('../models/BrandModel');
const CategoryModel = require('../models/CategoryModel');
const ProductSliderModel = require('../models/ProductSliderModel');
const ProductModel = require('../models/ProductModel');
const ProductDetailModel = require('../models/ProductDetailModel');
const ReviewModel = require('../models/ReviewModel');

const BrandListService = async () => {
    try {
        let data = await BrandModel.find();
        
        return {status: "success", data: data};
    } catch (error) {
        return {status: "fail", data: error};
    }
};

const CategoryListService = async () => {
    try {
        let data = await CategoryModel.find();
        return {status: "success", data: data};
    } catch (error) {
        return {status: "fail", data: error};
    }
}

const SliderListService = async () => {
    try {
        let data = await ProductSliderModel.find();
        return {status: "success", data: data};
    } catch (error) {
        return {status: "fail", data: error};
    }
}

const ListByBrandService = async (req) => {
     try {
        
    let BrandID = new ObjectId(req.params.BrandID);
    let MatchStage = {$match: {brandID: BrandID}};
    let JoinWithBrandStage = {$lookup: {from: "brands", localField: "brandID", foreignField: "_id", as: "brand"}};
    let JoinWithCategoryStage = {$lookup: {from: "categories", localField: "categoryID", foreignField: "_id", as: "category"}};
    let UnwindBrandStage = {$unwind: "$brand"};
    let UnwindCategoryStage = {$unwind: "$category"};
    let ProjectionStage = {$project: {'brand._id': 0, 'category._id': 0 , 'brandID': 0, 'categoryID': 0, '__v': 0,  'brand.createdAt': 0, 'brand.updatedAt': 0, 'category.createdAt': 0, 'category.updatedAt': 0}};

    let data = await ProductModel.aggregate([MatchStage, JoinWithBrandStage, JoinWithCategoryStage, UnwindBrandStage, UnwindCategoryStage, ProjectionStage]);
    return {status: "success", data: data};

}

      catch (error) {
        return {status: "fail", data: error};  
        
     }
    }


const ListByCategoryService = async (req) => {
    try {
        
        let CategoryID = new ObjectId(req.params.CategoryID);
        let MatchStage = {$match: { categoryID : CategoryID}};
        let JoinWithBrandStage = {$lookup: {from: "brands", localField: "brandID", foreignField: "_id", as: "brand"}};
        let JoinWithCategoryStage = {$lookup: {from: "categories", localField: "categoryID", foreignField: "_id", as: "category"}};
        let UnwindBrandStage = {$unwind: "$brand"};
        let UnwindCategoryStage = {$unwind: "$category"};
        let ProjectionStage = {$project: {'brand._id': 0, 'category._id': 0 , 'brandID': 0, 'categoryID': 0, '__v': 0,  'brand.createdAt': 0, 'brand.updatedAt': 0, 'category.createdAt': 0, 'category.updatedAt': 0}};
    
        let data = await ProductModel.aggregate([MatchStage, JoinWithBrandStage, JoinWithCategoryStage, UnwindBrandStage, UnwindCategoryStage, ProjectionStage]);
        return {status: "success", data: data};
    
    }
    
          catch (error) {
            return {status: "fail", data: error};  
            
         }
}

const ListBySimilarService = async (req) => {
    
    try {
        
        let CategoryID = new ObjectId(req.params.CategoryID);
        let MatchStage = {$match: { categoryID : CategoryID}};
        let LimitStage = {$limit: 20};
        let JoinWithBrandStage = {$lookup: {from: "brands", localField: "brandID", foreignField: "_id", as: "brand"}};
        let JoinWithCategoryStage = {$lookup: {from: "categories", localField: "categoryID", foreignField: "_id", as: "category"}};
        let UnwindBrandStage = {$unwind: "$brand"};
        let UnwindCategoryStage = {$unwind: "$category"};
        let ProjectionStage = {$project: {'brand._id': 0, 'category._id': 0 , 'brandID': 0, 'categoryID': 0, '__v': 0,  'brand.createdAt': 0, 'brand.updatedAt': 0, 'category.createdAt': 0, 'category.updatedAt': 0}};
    
        let data = await ProductModel.aggregate([MatchStage,LimitStage, JoinWithBrandStage, JoinWithCategoryStage, UnwindBrandStage, UnwindCategoryStage, ProjectionStage]);
        return {status: "success", data: data};
    
    }
    
          catch (error) {
            return {status: "fail", data: error};  
            
         }
}

const ListByKeywordService = async (req) => {
        try {
            let SearchRegex = {$regex: req.params.Keyword, $options: 'i'};
            let SearchParams = [{title: SearchRegex}, {shortDes: SearchRegex}]
            let SearchQuery = {$or: SearchParams};
            let MatchStage = {$match: SearchQuery};

            let JoinWithBrandStage = {$lookup: {from: "brands", localField: "brandID", foreignField: "_id", as: "brand"}};
            let JoinWithCategoryStage = {$lookup: {from: "categories", localField: "categoryID", foreignField: "_id", as: "category"}};
            let UnwindBrandStage = {$unwind: "$brand"};
            let UnwindCategoryStage = {$unwind: "$category"};
            let ProjectionStage = {$project: {'brand._id': 0, 'category._id': 0 , 'brandID': 0, 'categoryID': 0, '__v': 0}};
        
            let data = await ProductModel.aggregate([MatchStage, JoinWithBrandStage, JoinWithCategoryStage, UnwindBrandStage, UnwindCategoryStage, ProjectionStage]);
            return {status: "success", data: data};
        
        }
               catch (error) {
                 return {status: "fail", data: error};  
                 
                 }
}

const ListByRemarkService = async (req) => {
    try {
        let Remark = req.params.Remark;
        let MatchStage = {$match: {remark: Remark}};
        let JoinWithBrandStage = {$lookup: {from: "brands", localField: "brandID", foreignField: "_id", as: "brand"}};
        let JoinWithCategoryStage = {$lookup: {from: "categories", localField: "categoryID", foreignField: "_id", as: "category"}};
        let UnwindBrandStage = {$unwind: "$brand"};
        let UnwindCategoryStage = {$unwind: "$category"};
        let ProjectionStage = {$project: {'brand._id': 0, 'category._id': 0 , 'brandID': 0, 'categoryID': 0, '__v': 0,  'brand.createdAt': 0, 'brand.updatedAt': 0, 'category.createdAt': 0, 'category.updatedAt': 0}};
    
        let data = await ProductModel.aggregate([MatchStage, JoinWithBrandStage, JoinWithCategoryStage, UnwindBrandStage, UnwindCategoryStage, ProjectionStage]);
        return {status: "success", data: data};
    
    }
    
          catch (error) {
            return {status: "fail", data: error};  
            
         }

}

const DetailsService = async (req) => {
    try {
        let ProductID = new ObjectId(req.params.ProductID);
        let MatchStage = {$match: {_id: ProductID}};

        let JoinWithBrandStage = {$lookup: {from: "brands", localField: "brandID", foreignField: "_id", as: "brand"}};
        let JoinWithCategoryStage = {$lookup: {from: "categories", localField: "categoryID", foreignField: "_id", as: "category"}};
        let JoinWithDetailStage = {$lookup: {from: "productdetails", localField: "_id", foreignField: "productID", as: "details"}};

        let UnwindBrandStage = {$unwind: "$brand"};
        let UnwindCategoryStage = {$unwind: "$category"};
        let UnwindDetailStage = {$unwind: "$details"};

        let ProjectionStage = {$project: {'brand._id': 0, 'category._id': 0 , 'brandID': 0, 'categoryID': 0, '__v': 0}};

        let data = await ProductModel.aggregate([MatchStage, JoinWithBrandStage, JoinWithCategoryStage, JoinWithDetailStage, UnwindBrandStage, UnwindCategoryStage, UnwindDetailStage, ProjectionStage]);
        return {status: "success", data: data};

    } catch (error) {
        return {status: "fail", data: error};
        
    }
}

const ReviewListService = async (req) => {
    try {
        let ProductID = new ObjectId(req.params.ProductID);
        let MatchStage = { $match: { productID: ProductID } };
        let JoinWithProfileStage = { $lookup: { from: "profiles", localField: "userID", foreignField: "userID", as: "profile" } };
        let UnwindProfileStage = { $unwind: "$profile" };
        let ProjectionStage = { $project: { 'des': 1, 'rating': 1, 'profile.cus_name': 1 } };
        let data = await ReviewModel.aggregate([MatchStage, JoinWithProfileStage, UnwindProfileStage, ProjectionStage]);
        if (!data || data.length === 0) {
            return { status: "error", message: "No data found" };
        }
        return { status: "success", data: data };
    } catch (error) {
        console.error("ReviewListService error:", error);
        return { status: "fail", data: error.message };
    }
}

const CreateReviewService = async (req) => {
    try {
        let user_id = req.headers.user_id;
        let reqBody = req.body;
       let data= await ReviewModel.create({
            productID : reqBody.productID,
            userID : user_id,
            des: reqBody.des,
            rating: reqBody.rating,
        })
       
        return {status: "success", data: data};
    } catch (error) {
        return {status: "error", message: error.message};
    }
}

const ListByFilterService = async (req) => {
    try {
        let matchCondition = {};
        if(req.body.categoryID){
            matchCondition.categoryID = new ObjectId(req.body.categoryID);
        }
        if(req.body.brandID){
            matchCondition.brandID = new ObjectId(req.body.brandID);
        }
        let MatchStage = {$match: matchCondition};
        let AddFieldsStage = {$addFields: {numericPrice: {$toInt: "$price"}}};
        let priceMin = parseInt(req.body.priceMin);
        let priceMax = parseInt(req.body.priceMax);
        let PriceMatchCondition = {};
        if(!isNaN(priceMin)){
            PriceMatchCondition.numericPrice = {$gte: priceMin};

        }
        if(!isNaN(priceMax)){
            PriceMatchCondition.numericPrice = {...(PriceMatchCondition.numericPrice || {}), $lte: priceMax};
        }
        let PriceMatchStage = {$match: PriceMatchCondition};

        let JoinWithBrandStage = {$lookup: {from: "brands", localField: "brandID", foreignField: "_id", as: "brand"}};
        let JoinWithCategoryStage = {$lookup: {from: "categories", localField: "categoryID", foreignField: "_id", as: "category"}};
        let UnwindBrandStage = {$unwind: "$brand"};
        let UnwindCategoryStage = {$unwind: "$category"};
        let ProjectionStage = {$project: {'brand._id': 0, 'category._id': 0 , 'brandID': 0, 'categoryID': 0, '__v': 0,  'brand.createdAt': 0, 'brand.updatedAt': 0, 'category.createdAt': 0, 'category.updatedAt': 0}};

        let data = await ProductModel.aggregate([MatchStage, AddFieldsStage, PriceMatchStage, JoinWithBrandStage, JoinWithCategoryStage, UnwindBrandStage, UnwindCategoryStage, ProjectionStage]);
        return {status: "success", data: data};
    } 
     catch (error) {
        console.log(error.message);
        return {status: "fail", data: error};
        
        
    }
}




module.exports = {
    BrandListService,
    CategoryListService,
    SliderListService,
    ListByBrandService,
    ListByCategoryService,
    ListBySimilarService,
    ListByKeywordService,
    ListByRemarkService,
    DetailsService,
    ReviewListService,
    CreateReviewService,
    ListByFilterService
}
