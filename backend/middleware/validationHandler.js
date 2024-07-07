module.exports = validationHandler = (err, res) => {
    if (err.name === 'ValidationError') {
        res.status(400).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}