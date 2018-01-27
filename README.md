# Passport
Learn Passport

# Sources used
# https://scotch.io/tutorials/easy-node-authentication-setup-and-local

# Paasport Docs
# http://www.passportjs.org/docs/

# Express Passport Error Handling
# https://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling

# Passport AzureAD Strategy (The new Way, use OIDCStrategy or BearerStrategy) vs. passport-azure-oauth
# https://github.com/AzureAD/passport-azure-ad

# Access O365 Resources from Node
# https://github.com/OfficeDev/O365-Node-Express-Ejs-Sample-App

# Azure: Migrate MongoDB to Cosmos DB
# https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction

# Token retrival and AAD Oauth explained
# https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-protocols-oauth-code

# Calculate expires_on (its delivered as seconds since unix)
$d = New-Object System.DateTime(1970, 1, 1, 0, 0, 0, 0 )
$d.AddSeconds(1516884006)

# Bearer Strategy Sample (Does not Work)
# https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-devquickstarts-webapi-nodejs

# Example OIDCStrategy
# https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-devquickstarts-node-web



# FORGET ALL About passport-azure-ad, According to MS only use MSAL.JS
# https://docs.microsoft.com/en-us/azure/active-directory/develop/guidedsetups/active-directory-javascriptspa

# The MSAL Library
# https://github.com/AzureAD/microsoft-authentication-library-for-js

# Video
# https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-appmodel-v2-overview

# Dev Guide
# http://aka.ms/aadv2
# https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-appmodel-v2-overview
# Register v2 apps here:
# http://apps.dev.microsoft.com

# NodeJs Express and Passport Session Management Deep Dive
# https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive