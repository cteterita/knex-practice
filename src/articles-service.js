const ArticlesService = {
  getAllArticles(knex) {
    return knex.select('*').from('blogful_articles');
  },
  getById(knex, id) {
    return knex.from('blogful_articles').select('*').where('id', id).first();
  },
  insertArticle(knex, newArticle) {
    return knex
      .insert(newArticle)
      .into('blogful_articles')
      .returning('*')
      .then((rows) => rows[0]);
  },
  deleteArticle(knex, id) {
    return knex('blogful_articles')
      .where({ id })
      .delete();
  },
  updateArticle(knex, id, newArticleData) {
    return knex('blogful_articles')
      .where({ id })
      .update(newArticleData);
  },
};

module.exports = ArticlesService;
