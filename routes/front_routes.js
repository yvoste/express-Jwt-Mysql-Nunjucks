
module.exports = app => { 
    const express = require('express')
    const router = express.Router()
    const front = require("../controllers/controller_frontend")

    router.get('/', front.home)
    router.get('/signup', front.signup)
    router.get('/signin', front.signin)
    router.get('/profil', front.profil)
    router.get('/logout', front.logout)
    router.get('/articles', front.articles)
    router.get('/article/:id', front.article)
    router.get('/add', front.addArticle)

    app.use('/', router);
};