const express = require('express');
const ProductController = require('../controllers/ProductController');
const UserController = require('../controllers/UserController');
const WishListController = require('../controllers/WishListController');
const CartListController = require('../controllers/CartListController');
const InvoiceController = require('../controllers/InvoiceController');
const FeaturesController = require('../controllers/FeaturesController');
const AuthVerification = require('../middlewares/AuthVerification');
const router = express.Router();

//product
router.get('/ProductBrandList',ProductController.ProductBrandList)
router.get('/ProductCategoryList',ProductController.ProductCategoryList)
router.get('/ProductSliderList',ProductController.ProductSliderList)
router.get('/ProductListByBrand/:BrandID',ProductController.ProductListByBrand)
router.get('/ProductListByCategory/:CategoryID',ProductController.ProductListByCategory)
router.get('/ProductListBySimilar/:CategoryID',ProductController.ProductListBySimilar)
router.get('/ProductListByKeyword/:Keyword',ProductController.ProductListByKeyword)
router.get('/ProductListByRemark/:Remark',ProductController.ProductListByRemark)
router.get('/ProductDetail/:ProductID',ProductController.ProductDetail)
router.get('/ProductReview/:ProductID',ProductController.ProductReviewList)

router.post('/ProductListByFilter',ProductController.ProductListByFilter)

//user
router.get('/UserOTP/:email',UserController.UserOTP)
router.get('/VerifyOTP/:email/:otp',UserController.VerifyOTP)
router.get('/UserLogout', AuthVerification ,UserController.UserLogout);
router.post('/CreateProfile',AuthVerification,UserController.CreateProfile);
router.post('/UpdateProfile',AuthVerification,UserController.UpdateProfile);
router.get('/ReadProfile',AuthVerification,UserController.ReadProfile);


//wishlist
router.get('/WishList',AuthVerification,WishListController.WishList);
router.post('/SaveWishList',AuthVerification,WishListController.SaveWishList);
router.post('/RemoveWishList',AuthVerification,WishListController.RemoveWishList);

//cartList
router.post('/SaveCartList',AuthVerification,CartListController.SaveCartList);
router.post('/RemoveCartList',AuthVerification,CartListController.RemoveCartList);
router.post('/UpdateCartList/:cartID',AuthVerification,CartListController.UpdateCartList);
router.get('/CartList',AuthVerification,CartListController.CartList);

//invoice and payment
router.get('/CreateInvoice',AuthVerification,InvoiceController.CreateInvoice);
router.get('/InvoiceList',AuthVerification,InvoiceController.InvoiceList);
router.get('/InvoiceProductList/:invoice_id',AuthVerification,InvoiceController.InvoiceProductList);

router.post('/PaymentSuccess/:trxID',InvoiceController.PaymentSuccess);
router.post('/PaymentFail/:trxID',InvoiceController.PaymentFail);
router.post('/PaymentCancel/:trxID',InvoiceController.PaymentCancel);
router.post('/PaymentIPN/:trxID',InvoiceController.PaymentIPN);


//features
router.get('/FeaturesList',FeaturesController.FeaturesList)
router.get('/LegalDetails/:type',FeaturesController.LegalDetails)


//review
router.post('/CreateReview',AuthVerification ,ProductController.CreateReview)

module.exports = router;