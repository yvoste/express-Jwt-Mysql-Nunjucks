
const home = (req, res, next) => {
  res.render('layouts/home.html', {home:{
      heading:"mon TitreHOME",
      img: "/img/monts.jpg",
      islogged: "true"
  }})   
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

