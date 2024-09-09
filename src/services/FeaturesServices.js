const FeaturesModel = require('../models/FeaturesModel');
const LegalModel = require('../models/LegalModel');
const FeaturesListService = async () => {
    try {
        let data = await FeaturesModel.find();
        
        return {status: "success", data: data};
    } catch (error) {
        
        return {status: "fail", data: error};
    }
}

const LegalDetailsService = async (req) => {
    try {
        let type = req.params.type;
        let data = await LegalModel.find({type: type});
        return {status: "success", data: data};
    
    } catch (error) {
        console.log('Error fetching Legal Details:', error);
        
        return {status: "fail", data: error};
    }
}

module.exports = {
    FeaturesListService,
    LegalDetailsService
}