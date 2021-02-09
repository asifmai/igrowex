const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apicontroller.js');

router.get('/articles', apiController.articles_get);

router.get('/article/:slug', apiController.article_get);



module.exports = router;