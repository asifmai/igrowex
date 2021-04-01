const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../apicontrollers/userscontroller');
const authController = require('../apicontrollers/authcontroller');
const articleController = require('../apicontrollers/articlescontroller.js');
const customersController = require('../apicontrollers/customerscontroller.js');
const emailController = require('../apicontrollers/emailcontroller.js');
const templatesController = require('../apicontrollers/templatescontroller.js');
const dashboardController = require('../apicontrollers/dashboardcontroller.js');

// Authenticate Using Passport
const login = passport.authenticate('local', { session: false });
const apiAuth = passport.authenticate('jwt', { session: false });

// Test Route
router.get('/', (req, res) => res.status(200).json({ status: 200, data: 'iGrowX API Server Running..' }));

// User Routes
router.post('/users', userController.register_post);
router.post('/users/login', login, authController.login_post);
router.put('/users', apiAuth, userController.users_put);
router.get('/users/me', apiAuth, authController.me_get);
router.post('/users/links', apiAuth, userController.users_links_post);
router.get('/users/setupcard', apiAuth, userController.setupcard_get);
router.post('/users/removecard', apiAuth, userController.removecard_post);

// Customers Routes
router.get('/customers', apiAuth, customersController.customers_get);
router.post('/customers', apiAuth, customersController.customers_post);
router.post('/customers/upload', apiAuth, customersController.customers_upload_post);
router.delete('/customers/:id', apiAuth, customersController.customers_delete);
router.put('/customers', apiAuth, customersController.customers_put);
router.post('/customers/delete-multiple', apiAuth, customersController.customers_delete_multiple_post);
router.get('/customers/:id/sendmessage', apiAuth, customersController.customers_send_message_get);

// Template Routes
router.get('/templates', apiAuth, templatesController.templates_get);
router.post('/templates', apiAuth, templatesController.templates_post);
router.delete('/templates/:id', apiAuth, templatesController.templates_delete);
router.get('/templates/select/:id', apiAuth, templatesController.templates_select_get);

// Dashboard Routes
router.get('/dashboard', apiAuth, dashboardController.dashboard_get);

// Articles Routes
router.get('/articles', articleController.articles_get);
router.get('/article/:slug', articleController.article_get);

// Email Routes
router.post('/sendmail', emailController.sendmail);

module.exports = router;
