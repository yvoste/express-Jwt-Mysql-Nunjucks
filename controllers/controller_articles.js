/*
This controller is in charge of managing the actions concerning the articles, the comments and the images. 
*/
const pool = require('../config/db.js')
let nunjucks = require("nunjucks")
const fs = require('fs')
const path = require('path')
// Another way to write the same thing using object destruction in ES6. 
// We use  directly the nickname of property to use fonctionnality
/*
const { readFileSync}  = require('fs');
const { join } = require('path');
*/



/**
 * Get list of articles
 * if the user is an administrator he has the role value 1 and all the items will be loaded.
  otherwise only the articles that have been published will be loaded as well as the articles of the author even if they have not been published yet.
  The pagination will determined by the two varibles offset and row
 */
 const articles = async (req, res, next) => { 
  console.log('ARTICLES')
  //console.log(req.body)
   // filter, this object contains all choiced element in filter (date_start date_end, autor, popular)
   // if the value of each element is empty it does nothing otherwise it modifies the request
  const filter = checkFilter(req.body)
  //console.log(filter)
  const set = parseInt(req.query.set) //- 1
  const offset = set <= 0 ? 0 : set
  const row_count = parseInt(req.query.row)
  if(typeof(offset)  !== 'number' || typeof(row_count) !== 'number') {
    const msg = 'An error occured with pagination'    
    return res.send({msg: msg, err:1})
  }
   
  let currentUser = [req.body.userIs] // this variable contains the nickname of the current user

  //construction of a sql query as a concatenated string
  let sql = 'SELECT a.*, COUNT(c.`id_comment`) nbcomments FROM `articles` a'
  sql += ' LEFT JOIN `comments` c'
  sql += ' ON a.`id_article` = c.`id_article`'
  sql += ' WHERE '
  if(parseInt(req.user.role) != 1 && req.body.author == '') {
    sql += ' a.`status` = 1 OR a.`author` = "' + currentUser + '"'
  } else if (parseInt(req.user.role) != 1 && req.body.author != '' && typeof req.body.author === 'string') {
    sql += ' a.`status` = 1 AND a.`author` = "' + req.body.author  + '"'
  } else if (parseInt(req.user.role) == 1 && req.body.author != '' && typeof req.body.author === 'string') {
    sql += ' a.`status` IN (0 , 1) AND a.`author` = "' + req.body.author  + '"'
  } else {
    sql += ' a.`status` IN (0 , 1)'
  }
  if(filter !== '') { // string return by function checkFilter between date
    sql += filter
  }
  sql += ' GROUP BY a.`id_article`' 
  if(parseInt(req.body.popular) != 0) {
    sql += ' ORDER BY a.`popular` DESC'
  }
  if(row_count !== 0) {  
    sql += ' LIMIT '+ offset + ', ' + row_count
  }
  //console.log(sql)

  // SQL1 query this request allows to get number of comments for each articles
  let sql1 = 'SELECT a.`id_article`, COUNT(*) FROM `articles` a'
  sql1 += ' WHERE '
  if(parseInt(req.user.role) != 1) {
    sql1 += ' a.`status` = 1'
  } else {
    sql1 += ' a.`status` = 1 OR a.`status` = 0'
  }
  if(req.body.author != '' && typeof req.body.author === 'string') {
    sql1 += ' AND a.`author` = "' + req.body.author  + '"'
  }
  if(filter !== '') { // string return by function checkFilter between date
    sql1 += filter
  }  
  // console.log(sql1)
  try {
    const [rows, fields] = await pool.execute (sql)
    const articles = rows
    const [raws, faields] = await pool.execute (sql1)
    const tot = raws[0]['COUNT(*)']
    console.log(tot)
    var dn = Date.now()
    for (let obj of articles) {
      Object.keys(obj).forEach(async (key) => {
        if(key == 'date_update'){
          const du = Date.parse(obj[key])
          obj.isOld =  Math.floor((dn - du) / 1000 / 60 / 60) // convert difference between date in minute
          // transfom  key in millisecondes
          // do difference between now and dateUp, convert in hours, set result into the object
        }
      })
    }
    //console.log(articles)
    // injected partials (a string) in layouts. This is a feautre of Nunjucks
    const template = fs.readFileSync(path.join(__dirname, '../', 'views/partials/listArticles.html'), 'utf8');   
    const output = nunjucks.renderString(template.toString(), {
      articles: articles,
      user: req.user.nickname,
      tot: tot
    })
    //console.log(output)
     res.json({content:output, err:0})
    
  } catch (error){
    console.log(error.message)
    res.json({msg: error.message, err:1})
  }
}

/**
 * Add new article
 */
 const add = async(req, res, next) => {
  console.log('ADD_ARTICLE')
  //console.log(req.body)
  const url = req.body.author +'/' + req.body.file
  try {
    let sql = 'INSERT INTO articles'
    sql += ' (`title`, `content`, `url_img`, `author`, `status`, `date_add`, `date_update`)'
    sql += ' VALUES (?, ?, ?, ?, ?, ?, ?)'
    const values = [req.body.title, req.body.content, url, req.body.author, req.body.status, dateIs, dateIs]
    const result = await pool.execute (sql, values)

    const ret = result[0].insertId
    if(!ret){
      res.send({'msg': "adding item failed", err:1})
    } else {
      res.send({'msg':"Item added successfully"})
    }
    
  } catch (error){
    console.log(error.message)
    res.send({'msg': error.message})
  }
}

/**
 * Get article and his comments by id 
 */
const article = async (req, res) => { 
  
  let sql = 'SELECT * FROM `articles` '
  sql += ' WHERE `articles`.`id_article` = ?'  

  let sql1 = 'SELECT * FROM `comments` '
  sql1 += ' WHERE `comments`.`id_article` = ?'

  const valu = [req.params.id]

  try {    
    const [raws, fields] = await pool.execute (sql, valu)
    //console.log(req.params.id)
    const article = raws[0]
    if (article.url_img !== "") {
      article.url_img = "/img/" + article.url_img
      const tp = article.url_img.split('.')[0]
      article.alt = tp.split('/')[3]
    }
    var dn = Date.now()
    Object.keys(article).forEach(async (key) => {
      if(key == 'date_update'){
        const du = Date.parse(article[key])
        article.isOld =  Math.floor((dn - du) / 1000 / 60 / 60) // convert difference between date in minute
        // transfom  key in millisecondes
        // do difference between now and dateUp, convert in hours, set result into the object
      }
    })    

    const [rows, faelds] = await pool.execute (sql1, valu)
    const comments = rows
    // this variable is used in front to display the delete button if the user is the autor of the article
    let autorized = 0  
    if(req.user.nickname === article.author){
      autorized = 1
    }
    // injected partials (a string) in layouts. This is a feautre of Nunjucks
    const template = fs.readFileSync(path.join(__dirname, '../', 'views/partials/article.html'), 'utf8');
    //console.log(template)
    const output = nunjucks.renderString(template.toString(), {
      article: article,
      comments: comments,
      userrole: req.user.role,
      autorized: autorized
    })
    //console.log(output)
    res.json({content:output, err:0})
    
  } catch (error){    
    res.json({msg: error.message, err:1})
  }
}

/**
 * To send an article for modifying it 
 */
const editArticle = async (req, res) => { 
  let sql = 'SELECT * FROM `articles` '
  sql += ' WHERE `articles`.`id_article` = ?'
  const val = [req.params.id] 

  try {    
    const [raws, fields] = await pool.execute (sql, val)
    //console.log(req.params.id)
    const article = raws[0]
    if (article.url_img !== "") {
      article.name_img = article.url_img
      article.url_img = "/img/" + article.url_img
      const tp = article.url_img.split('.')[0]
      article.alt = tp.split('/')[3]
    }
    article.id_article = req.params.id
    var dn = Date.now()
    Object.keys(article).forEach(async (key) => {
      if(key == 'date_update'){
        const du = Date.parse(article[key])
        article.isOld =  Math.floor((dn - du) / 1000 / 60 / 60) // convert difference between date in minute
        // transfom  key in millisecondes
        // do difference between now and dateUp, convert in hours, set result into the object
      }
    })
    // injected partials (a string) in layouts. This is a feautre of Nunjucks
    const template = fs.readFileSync(path.join(__dirname, '../', 'views/partials/edit_article.html'), 'utf8');
    //console.log(template)
    const output = nunjucks.renderString(template.toString(), {
      article: article
    })
    //console.log(output)
    res.json({content:output, err:0})
    
  } catch (error){    
    res.json({msg: error.message, err:1})
  }
}

/*
Update an article
*/
const update= async(req, res, next) => {
  console.log('UPDATE_ARTICLE')
  //console.log(req.body)
	let url = req.body.file  
  const file = req.body.file .split('/')  
  if(typeof(file[1]) === 'undefined'){    
    url = req.body.author +'/' + req.body.file  
  }
  try { 
    const sql = 'UPDATE `articles` SET `title` = ? , `content` = ?, `url_img` = ?, `date_update` = ? WHERE `id_article` = ?'    
    const value = [req.body.title, req.body.content, url, dateIs, req.body.id_article]
    const result = await pool.execute (sql, value)
    if(result[0].affectedRows === 1){
      res.send({'msg': 'Item updated successfully'})
    } else {
      res.send({'msg': 'An error occured'})
    }
  } catch (error){
    console.log(error.message)
    res.send({'msg': error.message})
  }
}

/*
Delete an article
*/
const delArticle = async (req, res) => {
  console.log(req.body)
  try { 
    const sql = 'DELETE FROM `articles` WHERE `id_article` = ? '
    const value = [req.body.id]
    const result = await pool.execute (sql, value)
    if(result) {
      res.send({'msg': 'Item successfully deleted'})
    } else{
      res.send({'msg': 'An error occured, impossible to delete the item'})
    }
    
  } catch (error){
    console.log(error.message)
    res.send({'msg': error.message})
  }

}

/*
This feature is only available if you are connected as admin
*/
const publish = async (req, res) => {
  console.log(req.body)
  try {
    const sql = 'UPDATE `articles` SET `status` = ? WHERE `id_article` = ?'    
    const value = [1, req.body.id]
    const result = await pool.execute (sql, value)

    if(result[0].affectedRows === 1){
      res.send({'msg': 'published successfully'})
    } else {
      res.send({'msg': 'An error occured'})
    }
  } catch (error){
    console.log(error.message)
    res.send({'msg': error.message})
  }

}

/**
 * Add comment
 */
const addComment = async (req, res) => {
  console.log('Add----Comment')
  console.log(req.body)
  try {
    // this is to increment the value of te number of comments in articles table
    const sqlS = 'SELECT `popular` FROM `articles`  WHERE `id_article` = ?'
    const vol = [req.body.id_article]
    const [rows, fields] = await pool.execute (sqlS, vol)
    const pop = rows[0].popular + 1
    console.log(pop)
    
    const sql = 'INSERT INTO comments (`id_article`, `comment`,  `author_comment`, `date_add`) VALUES (?, ?, ?, ?)'
    const values = [req.body.id_article, req.body.comment, req.body.author_comment, dateIs]    

    const sql1 = 'UPDATE `articles` SET `popular` = ?  WHERE `id_article` = ?'   
    const value = [pop, req.body.id_article]

    const result = await pool.execute (sql , values)    
    const ret = result[0].insertId
    if(ret){
      //the incremented value is inserted in the DB only if the comment has well been  inserted.
      await pool.execute (sql1, value)
      res.send({'msg': 'Comment added succefully'})
    }    
  } catch (error){
    //console.log(error.message)
    res.send({'msg': error.message})
  }

}

/*
Delete comment
*/
const delComment = async (req, res) => {
  console.log(req.body)
  try { 
    const sql = 'DELETE FROM `comments` WHERE `id_comment` = ? AND `id_article` = ?'
    const value = [req.body.idC, req.body.id]

    const sql1 = 'UPDATE `articles` SET `popular` = `popular` - 1  WHERE `id_article` = ?'    
    const val = [req.body.id]

    const result = await pool.execute (sql, value)
    if (result[0].affectedRows === 1 ){
      // the decremented value is inserted in the DB only if the comment has well been deleted.
      await pool.execute (sql1, val)
    }
    //console.log(result[0].affectedRows)

    res.send({'msg': 'Deleted successfully'})
  } catch (error){
    //console.log(error.message)
    res.send({'msg': error.message})
  }

}

/**
 * Send url file uploaded
 */
 const upload = async(req, res, next) => {
  //nothing is doing here, all the job had been realized in the middleware before, this is just the end of the request
  try {
    res.send({'msg': req.file})
  } catch (error){
    console.log(error.message)
    res.send({msg: error.message})
  }
}

/*
remove file in folder (public/nickname of user/filename)
*/
const delFile = async (req, res) => {  
  const pith = path.join(__dirname, '../', '/public/img/' + req.user.nickname + '/' + req.body.name)
  console.log(pith)
  try { 
    fs.unlinkSync(pith)
    res.send({'msg': 'removed file successfully'})
  } catch (error){
    //console.log(error.message)
    res.send({'msg': error.message})
  }

}

/*
This function is called to fill the selector who contains the authors in the filter
*/
const autor = async (req, res) => {
  let sql = 'SELECT `author` FROM `articles` '
  sql += ' GROUP BY `author`'  

  try {    
    const [raws, fields] = await pool.execute (sql)
    const autors = raws
    res.send({autors: autors})
  } catch (error){
    console.log(error.message)
    res.send({'msg': error.message})
  }

}
    
// FUNCTION
const dateIs = new Date().toISOString().slice(0, 19).replace('T', ' ')

const checkFilter = (filter) => {
  //console.log(filter.dateStart)
  //console.log(filter.dateEnd)
  let sql = ''
  if(filter.dateStart !== '' && filter.dateEnd === '') {
    sql += ' AND a.`date_update` >= "' + filter.dateStart + '"'
  } else if(filter.dateStart === '' && filter.dateEnd !== '') {
    sql += ' AND a.`date_update` <= "' + filter.dateEnd + '"'
  } else if(filter.dateStart !== '' && filter.dateEnd !== '') {
    sql += ' AND a.`date_update` BETWEEN "' + filter.dateStart + '" AND "' + filter.dateEnd + '"'
  } else {
    sql = ''
  }
  return sql;
}


module.exports = {
  articles,
  article,
  add,
  editArticle,
  update,  
  upload,
  publish,
  delArticle,
  addComment,
  delComment,
  delFile,
  autor
  
}