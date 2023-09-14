const sourcePath = './dev';

const categories = require(`${sourcePath}/categories.json`);

module.exports = {
  up: (queryInterface) => {
    const now = new Date();
    const timestamps = {
      createdAt: now,
      updatedAt: now,
    };

    return queryInterface.sequelize.transaction(async (transaction) => {
      try {
        console.log('Seeding categories...');
        await queryInterface.bulkInsert(
          'categories',
          categories.map((data) => ({
            ...data,
            ...timestamps,
          })),
          { transaction }
        );
      } catch (err) {
        console.log(err);
        transaction.rollback();
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      try {
        console.log('Unseeding categories...');
        await queryInterface.bulkDelete('categories', null, {
          transaction,
        });
      } catch (err) {
        console.log(err);
        transaction.rollback();
      }
    });
  },
};
