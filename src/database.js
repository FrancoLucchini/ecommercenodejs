const mongoose = require('mongoose');

const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}

mongoose.connect(process.env.MONGODB_URI, opts);

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Database is connected');
})

connection.on('error', (err) => {
    console.log(err);
})
