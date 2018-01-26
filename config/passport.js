// configure passport

var AzureOAuthStrategy = require('passport-azure-oauth').Strategy;
var appSettings = require('./appSettings.js');

var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        })
    });

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email': email }, function (err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);
                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    // if there is no user with that email
                    // create the user
                    var newUser = new User();
                    // set the user's local credentials
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
                    // save the user
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        }));
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) { // callback with email and password from our form
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email': email }, function (err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);
                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                // all is well, return successful user
                return done(null, user);
            });
        }));

    passport.use('azureoauth', new AzureOAuthStrategy(
        appSettings.oauthOptions,
        function Verify(accessToken, refreshToken, params, profile, next){
            validate({
                'accessToken': accessToken,
                'refreshToken': refreshToken,
                'tokenParams': params,
                'userProfile': profile
            },
            function(err, user){
                passport.user = null;
                if(err)
                    return next(err);
                if(user) {
                   
                passport.user = user;
                return next(null, user);
                }
            });
        })
    );

    validate = function(result, next) {
        if (!result) {
            return next('invalid user');
        } else if (!result.accessToken) {
            return next('invalid credentials');
        } else {
            User.findOne({ 'o365.email': result.userProfile.username }, function (err, user) {
                if(err)
                    return next(err);
                
                    if(!user)
                        {
                            var newUser = new User();
                            newUser.o365.displayName = result.userProfile.displayname;
                            newUser.o365.email = result.userProfile.username;
                            newUser.o365.accessToken = result.accessToken;
                            newUser.o365.refreshToken = result.refreshToken;
                            result.tokenParams.refresh_token = result.refreshToken;

                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return next(null, newUser);
                            });

                        }
                        else
                        {
                            return next(null, user);
                        }
                    });
            }
    };

    passport.getAccessToken = function(resource, req, res, next) {
        if (passport.user.hasToken(resource)) {
            return next();
        } else {
            var data = 'grant_type=refresh_token' 
            + '&refresh_token=' + passport.user.refresh_token 
            + '&client_id=' + appSettings.oauthOptions.clientId 
            + '&client_secret=' + encodeURIComponent(appSettings.oauthOptions.clientSecret) 
            + '&resource=' + encodeURIComponent(resource);
            var opts = {
                url: appSettings.apiEndpoints.accessTokenRequestUrl,
                body: data,
                headers : { 'Content-Type' : 'application/x-www-form-urlencoded' }
            };
            require('request').post(opts, function (err, response, body) {
                if (err) {
                    return next(err)
                } else {
                    var token = JSON.parse(body);
                    passport.user.setToken(token);
                    return next();
                }
            })
        }
    }
}