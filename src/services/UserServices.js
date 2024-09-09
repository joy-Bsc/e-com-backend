const UserModel = require("../models/UserModel");
const ProfileModel = require("../models/ProfileModel");
const EmailSend = require("../utility/EmailHelper");
const { EncodeToken } = require("../utility/TokenHelper");

const UserOTPService = async(req) => {
    try {
        let email = req.params.email;
        let code = Math.floor(100000 + Math.random() * 900000);
        let EmailText = `Your Ecommerce OTP is ${code}`;
        let EmailSubject = "Email Verification";
        await EmailSend(email,EmailText,EmailSubject);
        await UserModel.updateOne({email:email},{$set:{otp:code}}, {upsert: true});
        return {status:"success",message:"OTP sent successfully"};
    } catch (error) {
        return {status:"fail",message:error.message};
    }
}

const VerifyOTPService = async(req) => {
    try {
        let email = req.params.email;
        let otp = req.params.otp;
        // User count
        let total = await UserModel.countDocuments({email: email, otp: otp});
        if (total === 1) {
            // User id read
            let user = await UserModel.findOne({email: email, otp: otp}).select('_id');
            // User token create
            let token = EncodeToken(email, user._id.toString());
            // OTP code update
            await UserModel.updateOne({email: email}, {$set: {otp: 0}});
            return {status: "success", message: "OTP verified successfully", token: token};
        } else {
            return {status: "fail", message: "OTP verification failed"};
        }
    } catch (error) {
        return {status: "fail", message: error.message};
    }
}

const LogoutService = async(req) => {
}

const SaveProfileService = async(req) => {
   try {
    let user_id = req.headers.user_id;
    let reqBody = req.body;
    reqBody.userID = user_id;
    await ProfileModel.updateOne({userID:user_id}, {$set:reqBody}, {upsert: true});
    return {status:"success",message:"Profile saved successfully"};
   } catch (error) {
    console.log(error.toString());
    return {status:"fail",message:error.toString()};
   }
}

const UpdateProfileService = async(req) => {
}

const ReadProfileService = async(req) => {
    try {
        let user_id = req.headers.user_id;
        let result = await ProfileModel.findOne({userID:user_id});
        return {status:"success",data:result};
    } catch (error) {
        return {status:"fail",message:error.message};
        
    }
}

module.exports = {
    UserOTPService,
    VerifyOTPService,
    LogoutService,
    SaveProfileService,
    UpdateProfileService,
    ReadProfileService
}