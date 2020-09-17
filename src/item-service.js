const ItemService = {
  getAllItems(knex) {
    return knex.select('*').from('shopping_list');
  },
  getById(knex, id) {
    return knex.from('shopping_list').select('*').where('id', id).first();
  },
  insertItem(knex, newArticle) {
    return knex
      .insert(newArticle)
      .into('shopping_list')
      .returning('*')
      .then((rows) => rows[0]);
  },
  deleteItem(knex, id) {
    return knex('shopping_list')
      .where({ id })
      .delete();
  },
  updateItem(knex, id, newItemData) {
    return knex('shopping_list')
      .where({ id })
      .update(newItemData);
  },
};

module.exports = ItemService;
