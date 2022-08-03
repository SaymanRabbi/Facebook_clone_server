exports.home = (req, res) => {
    res.status(200).json({
        message: 'Welcome to the API',
        error: false
    })
}