const adminAuth = (req, res, next) => {
    const token = 'xyz'; // Simulating token retrieval
    const isAdminAuthorized = token === 'xyz'; // Simulating admin authorization check
    if (isAdminAuthorized) {
        next();
    } else {
        res.status(403).send("Access denied");
    }   
}

module.exports = adminAuth;