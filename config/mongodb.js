const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

module.exports = {
    mongodburi: 'mongodb://' + DB_USERNAME + ':' + DB_PASSWORD + '@cluster0-mdbw4.mongodb.net/test?retryWrites=true&w=majority'
};