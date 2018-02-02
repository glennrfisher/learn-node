const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
}

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' });
}

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply a name!').notEmpty();
    req.checkBody('email', 'That email is not valid!').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_extension: false,
        gmail_remove_dots: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password cannot be empty!').notEmpty();
    req.checkBody('password-confirm', 'Your passwords do not match!').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(error => error.msg));
        res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
        return;
    }
    next();
};

exports.register = async (req, res, next) => {
    const user = new User({ name: req.body.name, email: req.body.email });
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    next();
};

exports.account = (req, res) => {
    res.render('account', { title: 'Edit Your Account' });
};

exports.updateAccount = async (req, res) => {
    const query = { _id: req.user._id };
    const updates = { $set: { name: req.body.name, email: req.body.email }};
    const options = { new: true, runValidators: true, context: 'query' };
    const user = await User.findOneAndUpdate(query, updates, options);
    req.flash('success', 'Updated the profile!');
    res.redirect('back');
}