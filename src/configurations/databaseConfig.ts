export default () => ({
  database: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/mydb',
  },
});
