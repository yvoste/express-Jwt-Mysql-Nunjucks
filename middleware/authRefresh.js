const jwt = require("jsonwebtoken")
const pool = require('../config/db.js')

module.exports = async(req, res, next) => {
    try {
      if(typeof(req.user) === 'undefined'){
        
        console.log('REFRESH YES')
        const { cookies, headers } = req;
        console.log(cookies)
        console.log(headers['x-xsrf-token'])
        
        /* We check that the JWT is present in the cookies of the request */
        if (!cookies.refresh_token) {
          return res.status(401).json({ msg: 'an error occured, missing cookie' });
        }
        
        /* We check token CSRF is present in request header  */
        if (!headers || !headers['x-xsrf-token']) {
            return res.status(401).json({ msg: 'Missing XSRF token in headers' });
        }

        const refreshToken = cookies.refresh_token
        const xsrfToken = headers['x-xsrf-token']
            
        console.log(refreshToken)

        const sqlA = 'SELECT * FROM `authuser`  WHERE `refreshToken` = ? AND `active` = ?'
        const val = [refreshToken, 1]
        const [rows, fields] = await pool.execute (sqlA, val) 
        const result = rows[0]
        console.log('result')
        console.log(result)
        if(!result){ 
            return res.status(403).json({msg: 'Your Account had been deactived contact Administrator', err:1})
        }
        req.user = jwt.verify(refreshToken, process.env.refreshTokenSecret)
        const sqlB = 'SELECT * FROM `user`  WHERE `id_user` = ?'
        const valu = [req.user.id_user]
        const [raws, faields] = await pool.execute (sqlB, valu)
        const user = raws[0]
        console.log(user)                
        if (!user) {
            return res.status(401).json({msg: "Access denied User not found, you must be loggin again.", err:1})
        }                        
    
        const ret = updateToken(user, xsrfToken)
        const accessToken = ret[0]
        const rufreshToken = ret[1]
        const sql1 = 'UPDATE `authuser` SET `refreshToken` = ?, `date_update` = ?  WHERE `id_user` = ? AND `active` = 1'
        const values = [rufreshToken, dateIs, user.id_user]
        const resultat = await pool.execute (sql1 , values)
        
        if (!resultat) {
        return res.json({msg : 'failed update refreshToken in DB'})
        }
        /* update cookie access_token*/                        
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: false,  // true only with https
            maxAge: parseInt(process.env.maxAge)  // one year
        });
        /* update cookie refresh_token*/                      
        res.cookie('refresh_token', rufreshToken, {
            httpOnly: true,
            secure: false,  // true only with https
            maxAge: parseInt(process.env.maxAge)  // one year
        })
      } else {console.log('REFRESH NO')}      
      next(); // next allow to continue the traitment in the intial function router
    } catch (error) {
      console.log(error)
      if(error.name == 'TokenExpiredError'){
        res.status(401).json({msg : "Access denied You must be loggout and loggin again."})
      } else {
          res.status(400).json({msg : "Invalid refreshToken"})
      }  
    }
}
const updateToken = (user, xsrfToken) => {
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
  //console.log(token)
  //console.log(refreshToken)
  return [token, refreshToken]
}

const dateIs = new Date().toISOString().slice(0, 19).replace('T', ' ')
