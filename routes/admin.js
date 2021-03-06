const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller');
const articleController = require('../controllers/articlecontroller');
const usersController = require('../controllers/userscontroller');
const auth = require('../helpers/auth');

/* GET users listing. */
router.get('/', auth.ensureAuthenticatedAdmin, adminController.admin_get);

/* GET - Public - Show admin log in page */
router.get('/login', adminController.login_get);

/* POST - Public - admin log */
router.post('/login', adminController.login_post);

/* GET - Public - admin log out */
router.get('/logout', auth.ensureAuthenticatedAdmin, adminController.logout_get);

// Articles Routes
router.get('/articles', auth.ensureAuthenticatedAdmin, articleController.article_get);
router.get('/articles/add', auth.ensureAuthenticatedAdmin, articleController.addarticle_get);
router.post('/articles', auth.ensureAuthenticatedAdmin, articleController.article_post);
router.get('/articles/delete/:id', auth.ensureAuthenticatedAdmin, articleController.article_delete);
router.get('/articles/edit/:id', auth.ensureAuthenticatedAdmin, articleController.editarticle_get);
router.post('/articles/edit', auth.ensureAuthenticatedAdmin, articleController.editarticle_post);

// Users Routes
router.get('/users', auth.ensureAuthenticatedAdmin, usersController.users_get);
router.get('/users/delete/:id', auth.ensureAuthenticatedAdmin, usersController.users_delete_get);
router.get('/users/edit/:id', auth.ensureAuthenticatedAdmin, usersController.users_edit_get);
router.post('/users/edit/:id', auth.ensureAuthenticatedAdmin, usersController.users_edit_post);

module.exports = router;
