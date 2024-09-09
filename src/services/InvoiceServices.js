const mongoose = require('mongoose');
const ProfileModel = require('../models/ProfileModel');
const CartModel = require('../models/CartModel');
const InvoiceModel = require('../models/InvoiceModel');
const InvoiceProductModel = require('../models/InvoiceProductModel');
const PaymentSettingModel = require('../models/PaymentSettingModel');
const FormData = require('form-data');
const axios = require('axios');

const CreateInvoiceService = async (req) => {
    let user_id = new mongoose.Types.ObjectId(req.headers.user_id);
    let cus_email = req.headers.email;

    //calculate total payable vat
    let matchStage = {$match: {userID : user_id}};
    let JoinStage ={$lookup: {from: "products", localField: "productID", foreignField: "_id", as: "product"}};
    let unwindStage = {$unwind: "$product"};
    let CartProducts = await CartModel.aggregate([matchStage, JoinStage, unwindStage]);

    let totalAmount = 0;    
    CartProducts.forEach((element)=>{
        let price;
        if(element["product"]["discount"] ){
            price = parseFloat(element["product"]['discountPrice']);
        }
        else{
            price = parseFloat(element["product"]['price']);
        }
        totalAmount += price * element['qty'];
            })
            let vat = totalAmount * 0.05;  //5% vat
            let payable = totalAmount + vat;

            //prepare customer details and shipping details
            const profile = await ProfileModel.aggregate([matchStage]);
            
         const cus_details = `Name: ${profile[0].cus_name}, Email: ${cus_email}, Address: ${profile[0].cus_add}, Phone: ${profile[0].cus_phone}`;
        const shipping_details = `Name: ${profile[0].ship_name}, City: ${profile[0].ship_city}, Address: ${profile[0].ship_add}, Phone: ${profile[0].ship_phone}`;
    // Proceed with your logic here

            //transaction and other id
            let tran_id = Math.floor(10000000 + Math.random() * 90000000);
            let val_id=0;
            let delivery_status = "Pending";
            let payment_status = "Pending";

            //create invoice

            let createInvoice = await InvoiceModel.create({
                    userID: user_id,
                    payable: payable,
                    cus_details: cus_details,
                     ship_details: shipping_details,
                     tran_id: tran_id,
                    val_id: val_id,
                    payment_status: payment_status,
                    delivery_status: delivery_status,
                    total: totalAmount,
                    vat: vat
            });

            //create invoice product
            let invoiceID = createInvoice._id;
            CartProducts.forEach(async(element)=>{
                await InvoiceProductModel.create({
                    userID: user_id,
                     productID: element['productID'],
                     invoiceID: invoiceID,
                     qty: element['qty'],
                     price: element['product']['discount'] ? element['product']['discountPrice'] : element['product']['price'],
                     color: element['color'],
                    size: element['size'],
                });
            });

            //Remove cart products
            await CartModel.deleteMany({userID: user_id});

            //prepare ssl payment
            let paymentSetting = await PaymentSettingModel.find();

            const form = new FormData();

            form.append('store_id', paymentSetting[0].store_id);
            form.append('store_passwd', paymentSetting[0].store_passwd);
            form.append('total_amount', payable.toString());
            form.append('currency', paymentSetting[0].currency);
            form.append('tran_id', tran_id);
            form.append('success_url', `${paymentSetting[0].success_url}/${tran_id}`);
            form.append('fail_url', `${paymentSetting[0].fail_url}/${tran_id}`);
            form.append('cancel_url', `${paymentSetting[0].cancel_url}/${tran_id}`);
            form.append('ipn_url', `${paymentSetting[0].ipn_url}/${tran_id}}`);

            form.append('cus_name', profile[0].cus_name);
            form.append('cus_email', cus_email);
            form.append('cus_add1', profile[0].cus_add);
            form.append('cus_add2', profile[0].cus_add);
            form.append('cus_city', profile[0].cus_city);
            form.append('cus_state', profile[0].cus_state);
            
            form.append('cus_country', profile[0].cus_country);
            form.append('cus_phone', profile[0].cus_phone);
            form.append('cus_fax', profile[0].cus_phone);

            form.append('shipping_method', 'YES')

            form.append('ship_name', profile[0].ship_name);
            form.append('ship_add1', profile[0].ship_add);
            form.append('ship_add2', profile[0].ship_add);
            form.append('ship_city', profile[0].ship_city);
            form.append('ship_state', profile[0].ship_state);
            form.append('ship_country', profile[0].ship_country);
            form.append('ship_postcode', profile[0].ship_postcode);

            form.append('product_name', 'According Invoice');
            form.append('product_category', 'According Invoice');
            form.append('product_profile', 'According Invoice');
            form.append('product_amount', 'According Invoice');

            let SSLRes = await axios.post(paymentSetting[0].init_url, form)
                
          


                    
    return {status:"success", data:SSLRes.data};
}


const PaymentFailService = async (req) => {
    try {
        let trxID = req.params.trxID;
        await InvoiceModel.updateOne({tran_id: trxID}, {payment_status: "fail"});
        return {status: "fail", message: "Payment failed"};
    } catch (error) {
        return {status: "error", message: error.message};
        
    }
}


const PaymentCancelService = async (req) => {
    try {
        let trxID = req.params.trxID;
        await InvoiceModel.updateOne({tran_id: trxID}, {payment_status: "cancel"});
        return {status: "cancel", message: "Payment cancel"};
    } catch (error) {
        return {status: "error", message: error.message};
        
    }
}


const PaymentIPNService = async (req) => {
    try {
        let trxID = req.params.trxID;
        let status = req.body.status;
        await InvoiceModel.updateOne({tran_id: trxID}, {payment_status: status});
        return {status: "success"};
    } catch (error) {
        return {status: "error", message: error.message};
    }
}


const PaymentSuccessService = async (req) => {
    try {
        let trxID = req.params.trxID;
        await InvoiceModel.updateOne({tran_id: trxID}, {payment_status: "Success"});
        return {status: "success", message: "Payment Success"};
    } catch (error) {
        return {status: "error", message: error.message};
        
    }
}


const InvoiceListService = async (req) => {
    try {
        let user_id = req.headers.user_id;
        let invoice = await InvoiceModel.find({userID: user_id});
        return {status: "success", data: invoice};
    } catch (error) {
        return {status: "error", message: error.message};
    }
}


const InvoiceProductListService = async (req) => {
    try {
        let user_id = new mongoose.Types.ObjectId(req.headers.user_id);
        let invoice_id = new mongoose.Types.ObjectId(req.params.invoice_id);
        let matchStage = {$match: {userID: user_id, invoiceID: invoice_id}};
        let joinStage = {$lookup: {from: "products", localField: "productID", foreignField: "_id", as: "product"}};
        
        let unwindStage = {$unwind: "$product"};
        let product = await InvoiceProductModel.aggregate([matchStage, joinStage, unwindStage]);
        if (product.length === 0) {
            return { status: "error", message: "No products found for the given user_id and invoice_id" };
        }

        return { status: "success", data: product };

    } catch (error) {
        console.error("Error in InvoiceProductListService:", error);
        return { status: "error", message: error.message };
    }
}



module.exports = {CreateInvoiceService, PaymentFailService, PaymentCancelService, PaymentIPNService, PaymentSuccessService, InvoiceListService, InvoiceProductListService};
