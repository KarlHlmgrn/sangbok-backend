const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const uploadRouter = require('./routes/fileUpload');
const eventsRouter = require('./routes/events');
const eventRouter = require('./routes/event');
const userRouter = require('./routes/user');
const verifyToken = require('./middleware/verifyToken');

const { sequelize } = require('./db/db');

sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((error) => {
    console.error('Error syncing database:', error.message);
});

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON requests
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());

app.use(express.static('uploads'));
app.use('/upload', verifyToken, uploadRouter);
app.use('/events', eventsRouter);
app.use('/event', verifyToken, eventRouter);
app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});