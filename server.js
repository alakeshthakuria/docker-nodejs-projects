const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files (e.g., index.html)

// MongoDB connection
mongoose.connect('mongodb://admin:admin@localhost:27017/user-account?authSource=admin')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
