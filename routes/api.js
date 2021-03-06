const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../apicontrollers/userscontroller');
const authController = require('../apicontrollers/authcontroller');
const articleController = require('../apicontrollers/articlescontroller.js');
const customersController = require('../apicontrollers/customerscontroller.js');
const emailController = require('../apicontrollers/emailcontroller.js');

// Authenticate Using Passport
const login = passport.authenticate('local', { session: false });
const apiAuth = passport.authenticate('jwt', { session: false });

// Test Route
router.get('/', (req, res) => res.status(200).json({ status: 200, data: 'iGrowX API Server Running..' }));

// User Routes
router.post('/users', userController.register_post);
router.post('/users/login', login, authController.login_post);
router.get('/users/me', apiAuth, authController.me_get);

// Customers Routes
router.get('/customers', apiAuth, customersController.customers_get);
router.post('/customers', apiAuth, customersController.customers_post);
router.delete('/customers/:id', apiAuth, customersController.customers_delete);
router.put('/customers', apiAuth, customersController.customers_put);
router.post('/customers/delete-multiple', apiAuth, customersController.customers_delete_multiple_post);

// Articles Routes
router.get('/articles', articleController.articles_get);
router.get('/article/:slug', articleController.article_get);

// Email Routes
router.post('/sendmail', emailController.sendmail);

module.exports = router;
