const User = require('../../DB/models/userLogin');

const successGoogleLogin = async (req, res) => {
    try {
        let user = await User.findOne({ googleId: req.user.id });
        if (!user) {
            user = new User({
                googleId: req.user.id,
                displayName: req.user.displayName,
                email: req.user.email
            });
            await user.save();
        }
        res.render('userDashboard/userDashboard', { user: req.user });
        console.log(req.user);
    } catch (error) {
        console.error(error);
        res.send("Error occurred while saving user data");
    }
}

const failureGoogleLogin = (req, res) => {
    res.send("Error");
}

module.exports = {
    successGoogleLogin,
    failureGoogleLogin
}