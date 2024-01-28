import DBCred from './Sequelize';

const connectToDb = async () => {
    try {
        await DBCred.authenticate();
        console.log('PostgreSQL is connected Successfully');
    } catch (error) {
        console.log('Some error occurred in connection of PostgreSQL', error);
    }
};

const syncTheDb = async () => {
    try {
        await DBCred.sync();
        console.log('All tables are created successfully');
    } catch (error) {
        console.log('Some error occurred in the sync of the table ', error);
    }
};

export { connectToDb, syncTheDb };