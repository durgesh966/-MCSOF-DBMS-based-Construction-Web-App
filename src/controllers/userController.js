const loadAuth = (req, res) => {
    res.render('auth');
}

const successGoogleLogin = (req, res) => {
    if (!req.user) {
        res.status(401).send("Authentication failed");
        console.log("Authentication failed");
    } else {
        res.status(200).send("Welcome " + req.user.email); 
    }
};

const failureGoogleLogin = (req, res) => {
    res.status(500).send("Internal Server Error");
};

module.exports = { loadAuth, successGoogleLogin, failureGoogleLogin };
