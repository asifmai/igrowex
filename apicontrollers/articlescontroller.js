const Article = require('../models/Article');

module.exports.articles_get = async (req, res) => {
  const articles = await Article.find({published: true}).sort({priority: 'asc'});

  res.status(200).json({status: '200', data: articles});
}

module.exports.article_get = async (req, res) => {
  const slug = req.params.slug;
  const article = await Article.findOne({slug});
  const articles = await Article.find({published: true}).sort({priority: 'asc'}).select('slug');
  const slugs = articles.map(article => article.slug);

  if (article) {
    res.status(200).json({status: '200', data: {article, slugs}});
  } else {
    res.status(404).json({status: '404', data: 'Not Found'});
  }

}