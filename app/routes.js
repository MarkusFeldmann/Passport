module.exports = function (app, passport) {

    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', { user: req.user });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/login365', passport.authenticate('azureoauth', {
        failureRedirect: '/',
        successRedirect: '/profile'
    }));

    app.get('/auth/azureOAuth/callback', passport.authenticate('azureoauth', { 
        failureRedirect: '/' 
    }),
    function (req, res) {
        console.dir(passport.user.accessToken);
        res.redirect('/profile');
    });

}
    
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
};