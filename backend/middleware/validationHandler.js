module.exports = validationHandler = (error, res) => {
    if (error.name === 'ValidationError') {
        res.status(400).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}