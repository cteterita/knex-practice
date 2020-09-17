const knex = require('knex');
const ItemService = require('../src/item-service');

describe('Item service object', () => {
  let db;
  const testItems = [
    {
      id: 1,
      name: 'item 1',
      price: '19.99',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: true,
      category: 'Main',
    },
    {
      id: 2,
      name: 'item 2',
      price: '0.99',
      date_added: new Date('2029-01-24T16:28:32.615Z'),
      checked: true,
      category: 'Main',
    },
    {
      id: 3,
      name: 'item 3',
      price: '20.00',
      date_added: new Date('2029-01-26T16:28:32.615Z'),
      checked: true,
      category: 'Main',
    },
  ];
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });
  before(() => db('shopping_list').truncate());
  afterEach(() => db('shopping_list').truncate());
  after(() => db.destroy());

  context('Given \'shopping_list\' has data', () => {
    beforeEach(() => {
      return db.into('shopping_list').insert(testItems);
    });

    it('getAllArticles() resolves all articles from \'blogful_articles\' table', () => {
      return ItemService.getAllItems(db)
        .then((actual) => expect(actual).to.eql(testItems));
    });
    it('getById() resolves an article by id from \'blogful_articles\' table', () => {
      const thirdId = 3;
      const thirdTestItem = testItems[thirdId - 1];
      return ItemService.getById(db, thirdId)
        .then((actual) => {
          expect(actual).to.eql({
            id: thirdId,
            name: thirdTestItem.name,
            price: thirdTestItem.price,
            date_added: thirdTestItem.date_added,
            checked: thirdTestItem.checked,
            category: thirdTestItem.category,
          });
        });
    });
    it('deleteItem() removes an article by id from \'blogful_articles\' table', () => {
      const articleId = 3;
      return ItemService.deleteItem(db, articleId)
        .then(() => ItemService.getAllItems(db))
        .then((allArticles) => {
          // copy the test articles array without the "deleted" article
          const expected = testItems.filter((article) => article.id !== articleId);
          expect(allArticles).to.eql(expected);
        });
    });
    it('updateItem() updates an article from the \'shopping_list\' table', () => {
      const idOfArticleToUpdate = 3;
      const newItemData = {
        name: 'item 3 UPDATE',
        price: '25.00',
        date_added: new Date('2029-01-26T16:28:32.615Z'),
        checked: false,
        category: 'Main',
      };
      return ItemService.updateItem(db, idOfArticleToUpdate, newItemData)
        .then(() => ItemService.getById(db, idOfArticleToUpdate))
        .then((article) => {
          expect(article).to.eql({
            id: idOfArticleToUpdate,
            ...newItemData,
          });
        });
    });
  });
  context('Given \'shopping_list\' has no data', () => {
    it('getAllItems() resolves an empty array', () => {
      return ItemService.getAllItems(db)
        .then((actual) => expect(actual).to.eql([]));
    });
    it('insertItem() inserts a new article', () => {
      const newArticle = {
        id: 1,
        name: 'item 1',
        price: '19.99',
        date_added: new Date('2029-01-22T16:28:32.615Z'),
        checked: true,
        category: 'Main',
      };
      return ItemService.insertItem(db, newArticle)
        .then((actual) => {
          expect(actual).to.eql({
            id: 1,
            name: 'item 1',
            price: '19.99',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: true,
            category: 'Main',
          });
        });
    });
  });
});
