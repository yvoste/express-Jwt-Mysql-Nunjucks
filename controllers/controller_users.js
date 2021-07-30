/*
This controller is in charge of managing the actions concerning the users (signup, signin,  updating profil, logout)

Process:
when a user signup, a xrsf token is created (bcrypt is used but you can use cryptjs or what you want to create a random key) this key is stocked in local storage on browser and it's send in headers at each request.
This token is used to create a access_token (short duration life) and a refresh_token (long duration life) with JsonWebToken.
We put each key in a different cookie with a long maxAge because the cookies are just vehicles for token
At each request
Authentication:
For each request that requires authentication, the cookie acces-token is analized, if the access_token is expired  we check validity of the refresh token in the refresh token cookie and we chekc in databse if the refresh token is equal and if the user is actif if it's right we renew the access_token and the request contine otherwise the server return an error
For signup the password is hashed by bcrypt
*/
const pool = require('../config/db.js')
const bcrypt = require("bcrypt")
const Joi = require("joi")  // it used to check validoty of javbascript object
const jwt = require("jsonwebtoken")
let nunjucks = require("nunjucks")
const fs = require('fs')
const path = require('path')
// Another way to write the same thing using object destruction in ES6. 
// We use  directly the name of property to use fonctionnality
/*
const { readFileSync}  = require('fs');
const { join } = require('path');
*/


// Called when the user register to blog
// insert data in DB, give him a role value and generate a access_token,refresh_token and cookies
const signup = async (req, res, next) => {
  console.log(req.body) 
  try {
    // check validity of data
    const { error } = validate(req.body);
    if (error) {
      return res.json({msg: error.details[0].message}) 
    }

    const user = {
      nickname: req.body.nickname,
      password: req.body.password,
      email: req.body.email,
      role: req.body.role,
      date_add: dateIs,
      date_update: dateIs
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT))    
    user.password = await bcrypt.hash(user.password, salt)

    const sql = 'INSERT INTO user (email, password, nickname, role, date_add, date_update) VALUES (?, ?, ?, ?, ?, ?)'
    const value = [user.email, user.password, user.nickname, user.role, user.date_add, user.date_update]
    const result = await pool.execute (sql, value)
    user.id_user = result[0].insertId

    /* create token CSRF */
    const sel = await bcrypt.genSalt(5)    
    const xsrfToken = await bcrypt.hash(user.nickname, sel)
    console.log(xsrfToken)

    const ret = createToken(user, xsrfToken)
    const accessToken = ret[0]
    const refreshToken = ret[1]
    console.log('refreshToken')
    console.log(refreshToken)
    const sql1 = 'INSERT INTO `authuser` (`id_user`, `refreshToken`, `active`, `date_add`, `date_update`) VALUES(?, ?, ?, ?, ?)'
    const values = [user.id_user, refreshToken,  1, dateIs, dateIs]
    const resultat = await pool.execute (sql1 , values)
    if (!resultat) {
      return res.json({msg : 'failed insert refreshToken i DB'})
    }
    
    /* create JWT */
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,  // true only with https
      maxAge: parseInt(process.env.maxAge)  // one year
    });
 
    /* create refresh token */
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,  // true only with https
      maxAge: parseInt(process.env.maxAge)  // one year
    })

    res.json({
      msg: 'User was registered successfully!',
      id_user: user.id_user,
      nickname: user.nickname,
      role: user.role,
      xsrfToken
    })

  } catch (error){    
    res.json({msg: error.message})
  }
}

// Called when the user signin
const signin = async (req, res, next) => {
  //console.log(req.body.email)
  try {
    let sql = 'SELECT u.* FROM `user` u'
    sql += ' LEFT JOIN `authuser` a'
    sql += ' ON u.`id_user` = a.`id_user`'
    sql +=  ' WHERE u.`email` = ? AND a.`active` = ?'
    const vals = [req.body.email, 1]
    const [rows, fields] = await pool.execute (sql, vals) 
    const result = rows[0]

    if(!result){ 
      const msg = 'No Active User Found'
      return res.json({msg: msg, err:1})
    } 
    const user = {
      id_user:result.id_user,
      nickname: result.nickname,
      password: result.password,
      email: result.email,
      role: result.role
    }    

    const validPassword = await bcrypt.compare(req.body.password, result.password)

    if (!validPassword){ 
      const msg = 'invalid Password'
      return res.json({msg: msg, err:1})
    } 
    console.log(user)
    /*create CSRF */
    const sel = await bcrypt.genSalt(5)    
    const xsrfToken = await bcrypt.hash(user.nickname, sel)
    //console.log(xsrfToken)

    const ret = createToken(user, xsrfToken)
    const accessToken = ret[0]
    const refreshToken = ret[1]
    
    //console.log(refreshToken)
    
    const sql1 = 'UPDATE `authuser` SET `refreshToken` = ?, `date_update` = ?  WHERE `id_user` = ? AND `active` = 1'
    const values = [refreshToken, dateIs, user.id_user]
    const resultat = await pool.execute (sql1 , values)
    
    if(!resultat){
      return res.json({msg: 'update refresh token in DB failed'})
    } 

    /* create cookie access token */
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,  // true only with https
      maxAge: parseInt(process.env.maxAge)  // one year
    })
 
    /* create cookie refresh token */
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,  // true only with https
      maxAge: parseInt(process.env.maxAge)  // one year
    })

    res.json({
      msg: 'User was signin successfully!',
      id_user: user.id_user,
      nickname: user.nickname,
      role: user.role,
      xsrfToken
    })
  } catch (error){
    res.json({msg: error.message})
  }
}


// called to get  profil of user in database
const profil = async (req, res, next) => {
  try {
    const [rows, fields] = await pool.execute ('SELECT * FROM `user`  WHERE `id_user` = ?', [req.user.id_user]) 
    const result = rows[0]
    //console.log(result.email)

    if(!result) 
      return res.status(400).send("Invalid identifiant");      
    // this is used to injected partials (a string) in a layouts 
    const template = fs.readFileSync(path.join(__dirname, '../', 'views/partials/profil.html'), 'utf8');
    const output = nunjucks.renderString(template.toString(), {
      nickname: result.nickname,
      email: result.email,
    })
    res.json({content:output}) 
  } catch (error){
    res.json({msg: error.message})
  }
}


// called when the user update his profil
const update = async (req, res, next) => {  
  console.log(req.body) 
  try {
    const user = {
      id_user: req.user.id_user,
      nickname: req.body.nickname,
      email: req.body.email,
      role: req.user.role,
    }    
    // check validity of data
    const { error } = validateUp(user);
    if (error) {
      return res.json({msg: error.details[0].message})
    }

    const result = await pool.execute ('UPDATE user SET `email` = ?, `nickname` = ?, `date_update` = ? WHERE id_user = ?' , [user.email, user.nickname, dateIs, user.id_user])
    
    if(!result)
      return res.status(400).json({msg: "An error occured"})

    /* On créer le token CSRF */
    const sel = await bcrypt.genSalt(5)    
    const xsrfToken = await bcrypt.hash(user.nickname, sel)
    //console.log(xsrfToken)

    const ret = createToken(user, xsrfToken)
    const accessToken = ret[0]
    const refreshToken = ret[1]
    //console.log(refreshToken)
    
    const sql1 = 'UPDATE `authuser` SET `refreshToken` = ?, `date_update` = ?  WHERE `id_user` = ? AND `active` = 1'
    const values = [refreshToken, dateIs, user.id_user]
    const resultat = await pool.execute (sql1 , values)
    
    if(!resultat){
      return res.json({msg: 'insert refresh token in DB failed'})
    } 

    /* create cookie access token */
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,  // true only with https
      maxAge: parseInt(process.env.maxAge)  // one year
    })
 
    /* create cookie refresh token */
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,  // true only with https
      maxAge: parseInt(process.env.maxAge)  // one year
    })    

    res.json({
      msg: 'User was updated successfully!',
      id_user: user.id_user,
      nickname: user.nickname,
      role: user.role,
      xsrfToken
    })

  } catch (error){
    res.json({msg: error.message})
  }
}

const logout = async (req, res, next) => {
  //nothing is executed on server all the job is doing in front-end
  try {
    //the xrf token who is stocked in loca storage on browser will be deleted when request will be return successfullly
    res.json({msg: 'logout successfully'})
    
  } catch (error){
    res.json({msg: error.message})
  }
}


// Functions
const validate = (user) => {
  const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      nickname: Joi.string().required(),
      role: Joi.number(),
      date_add: Joi.string(),
      date_update: Joi.string()
  });
  return schema.validate(user);
}

const validateUp = (user) => {
  const schema = Joi.object({
      email: Joi.string().email().required(),
      nickname: Joi.string().required(),
      id_user: Joi.number().required(),
      role: Joi.number(),
  });
  return schema.validate(user);
}

const createToken = (user, xsrfToken) => {
  const token =  jwt.sign(
    { id_user: user.id_user, nickname: user.nickname, role: user.role, xsrfToken: xsrfToken},
    process.env.tokenSecret,
    {expiresIn: parseInt(process.env.tokenLife)}
  )
  const refreshToken = jwt.sign(
    { id_user: user.id_user, nickname: user.nickname, role: user.role },
    process.env.refreshTokenSecret,
    { expiresIn: parseInt(process.env.refreshTokenLife)}
  )  
  return [token, refreshToken]
}
// create a date with the format like datetime in mysql
const dateIs = new Date().toISOString().slice(0, 19).replace('T', ' ') 

module.exports = {
  signin,
  signup,
  profil,
  update,
  logout
}