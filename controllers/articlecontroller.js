const Article = require('../models/Article');
const path = require('path');
const fs = require('fs');

module.exports.article_get = async (req, res, next) => {
  const articles = await Article.find().select('-content').sort({editedAt: 'desc'});
  res.render('articles', {articles});
} 

module.exports.article_post = async (req, res, next) => {
  const title = req.body.title ? req.body.title.trim() : '';
  const published = req.body.published;
  const priority = req.body.priority ? Number(req.body.priority) : 10000;
  const content = req.body.content ? req.body.content : '';
  const slug = title.trim().replace(/[\~\`\!\@\#\$\%\^\&\*\(\)\_\+\=\[\]\{\}\'\|\\\"\;\:\/\?\.\,\>\<]/gi, '').trim().replace(/\s+/gi, '-').trim().toLowerCase();
  
  if (title == '' || content == '') {
    req.flash('error_msg', 'The Article must have a Title and Content');
    return res.redirect('/articles/add')
  }

  const newArticle = new Article({
    title, content, published, priority, slug
  });
  await newArticle.save();

  const fileExtension = /\.[0-9a-z]{1,5}$/i.exec(req.files.image.name)[0];
  const fileName = newArticle._id;
  const fullFileName = fileName + fileExtension;
  const filePath = path.resolve(__dirname, `../public/img/article-images/${fullFileName}`);
  await Article.findByIdAndUpdate(newArticle._id, {image: fullFileName});
  req.files.image.mv(filePath, (err) => {
    if (err) {
      console.log(err);
      res.redirect('/articles');
    } else {
      console.log('File Moved to Images..');
      req.flash('success_msg', 'Article added successfully');
      res.redirect('/articles');
    }
  });
} 

module.exports.article_delete = async (req, res, next) => {
  const foundArticle = await Article.findById(req.params.id);
  
  if (foundArticle.image) {
    const imagePath = path.resolve(__dirname, `../public/img/article-images/${foundArticle.image}`);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }

  await Article.findByIdAndDelete(req.params.id);
  
  req.flash('success_msg', 'Article Deleted Successfully');
  res.redirect('/articles');
} 

module.exports.editarticle_post = async (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title ? req.body.title.trim() : '';
  const published = req.body.published;
  const priority = req.body.priority ? Number(req.body.priority) : 10000;
  const content = req.body.content ? req.body.content.trim() : '';
  const slug = title.trim().replace(/[\~\`\!\@\#\$\%\^\&\*\(\)\_\+\=\[\]\{\}\'\|\\\"\;\:\/\?\.\,\>\<]/gi, '').trim().replace(/\s+/gi, '-').trim().toLowerCase();

  // Update Article
  const article = await Article.findById(id);
  await Article.findByIdAndUpdate(id, {
    title, published, content, editedAt: new Date(), priority, slug
  });

  // If a new Image was Selected
  if (req.files) {
    // Remove Old Image
    const imagePath = path.resolve(__dirname, `../public/img/article-images/${article.image}`);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    // Save new Image
    const fileExtension = /\.[0-9a-z]{1,5}$/i.exec(req.files.image.name)[0];
    const fileName = id;
    const fullFileName = fileName + fileExtension;
    const filePath = path.resolve(__dirname, `../public/img/article-images/${fullFileName}`);
    await Article.findByIdAndUpdate(id, {image: fullFileName});
    req.files.image.mv(filePath, (err) => {
      if (err) console.log(err);
    });
  }

  req.flash('success_msg', 'Article Updated Successfully');
  res.redirect('/articles');
} 

module.exports.addarticle_get = (req, res, next) => {
  res.render('addarticle')
} 

module.exports.editarticle_get = async (req, res, next) => {
  const foundArticle = await Article.findById(req.params.id);
  res.render('editarticle', {foundArticle});
} 