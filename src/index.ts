import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';
export default app;

dotenv.config();

const port = process.env.PORT || 3000;

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI || '', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

}).catch(err => {
    console.error('MongoDB connection error:', err);
});
