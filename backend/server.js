const app = require('./app');
const dbConnection = require('./DB/dbConnection');

const PORT = process.env.PORT || 3000
dbConnection();
app.listen(PORT, () => {
    console.log('server running on ' + PORT);
})