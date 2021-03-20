const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    priority: Number,
    published: {
      type: Boolean,
      required: true,
    },
    editedAt: {
      type: Date,
      default: Date.now,
    },
    slug: String,
  },
  { timestamps: true }
);

articleSchema.virtual('imagePath').get(function () {
  return '/img/article-images/' + this.image;
});

articleSchema.set('toObject', { virtuals: true });
articleSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Article', articleSchema);
