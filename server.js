require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Use built-in JSON parser
app.use(express.static(__dirname)); // Serve static files


// Determine if running inside Docker or locally
const isDocker = process.env.RUNNING_IN_DOCKER === 'true';

// MongoDB connection URI based on the environment
const mongoUrlDocker = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongo-container:27017/${process.env.MONGO_DB}?authSource=${process.env.MONGO_AUTH_SOURCE}`;
const mongoUrlLocal = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:27017/${process.env.MONGO_DB}?authSource=${process.env.MONGO_AUTH_SOURCE}`;

const mongoUrl = isDocker ? mongoUrlDocker : mongoUrlLocal;

// Connect to MongoDB
mongoose.connect(mongoUrl)
.then(() => {
console.log(`Connected to MongoDB using ${isDocker ? 'Docker' : 'local'} connection string!`);
})
.catch(err => {
console.error('Failed to connect to MongoDB:', err);
});

// Define the schemas
const nameSchema = new mongoose.Schema({ name: String });
const emailSchema = new mongoose.Schema({ email: String });

// Define the models
const Name = mongoose.model('Name', nameSchema, 'name');
const Email = mongoose.model('Email', emailSchema, 'email');

// Handle form submission
app.post('/submit', async (req, res) => {
    try {
        const { name, email } = req.body;

        const newName = new Name({ name });
        const newEmail = new Email({ email });

        await newName.save();
        await newEmail.save();

        res.json({ message: 'Data saved successfully!' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Failed to save data' });
    }
});

// Serve index.html on root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
