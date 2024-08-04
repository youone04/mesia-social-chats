const mongoose = require('mongoose');

const uri = "mongodb+srv://chat:dwb3MB.Yeh_xfp8@cluster0.jmivkzj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true
            }
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
