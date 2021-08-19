/*
This controller only load layouts and test the first time if database tables had been created
doc nunjucks https://mozilla.github.io/nunjucks/templating.html
*/

const pool = require('../config/db.js')

const home = async (req, res, next) => {
  try{ 
    await pool.execute ('SELECT COUNT(*) FROM `user`')
    await pool.execute ('SELECT COUNT(*) FROM `authuser`')
    await pool.execute ('SELECT COUNT(*) FROM `articles`') 
    await pool.execute ('SELECT COUNT(*) FROM `comments`') 

    res.render('layouts/home.html', {home:{
        heading:"mon TitreHOME",
        img: "/img/monts.jpg",
        islogged: "true",
        msg: 1
    }}) 
  } catch (error){
    res.render('layouts/home.html', {home:{
      heading:"mon TitreHOME",
      img: "/img/monts.jpg",
      islogged: "true",
      msg: error.message
    }})
  }
}

const signup = (req, res, next) => {
  res.render('layouts/signup.html')
}

const profil = (req, res, next) => {
  res.render('layouts/profil.html')
}

const articles = (req, res, next) => {
  res.render('layouts/articles.html')
}

const addArticle = (req, res, next) => {
  res.render('layouts/add-article.html')
}

const article = (req, res, next) => {
  res.render('layouts/article.html', {
    id: req.params.id
  })
}

const signin = (req, res, next) => {
  res.render('layouts/signin.html')
}

const logout = (req, res, next) => {
  res.render('layouts/logout.html')
}

module.exports = {
  home,
  signup,
  signin,
  profil,
  logout,
  articles,
  article,
  addArticle
}

