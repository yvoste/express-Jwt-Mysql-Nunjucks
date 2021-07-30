const jwt = require("jsonwebtoken")
const pool = require('../config/db.js')

module.exports = async(req, res, next) => {
    try {
        console.log('user__auth')
        const { cookies, headers } = req;
        
        /* We check that the JWT is present in the cookies of the request */
        if (!cookies || !cookies.access_token) {
          return res.status(401).json({msg: 'Missing or expired cookie, you must login again' });
        }
        
        /* We check token CSRF is present in request header  */
        if (!headers || !headers['x-xsrf-token']) {
            return res.status(401).json({msg: 'Missing XSRF token in headers' });
        }
        
        const accessToken = cookies.access_token
        const xsrfToken = headers['x-xsrf-token']
        
        req.user = jwt.verify(accessToken, process.env.tokenSecret)
        req.user.invalid = 0
        /* We check token CSRF is equal to the one present in JWT  */
        if (xsrfToken !== req.user.xsrfToken) {
            return res.status(401).json({msg: 'Bad xsrf token' });
        }

        /* We check if user exist in DB  */
        const sqlO = 'SELECT * FROM `user`  WHERE `id_user` = ?'
        const vlu = [req.user.id_user]
        const [rows, faields] = await pool.execute (sqlO, vlu) 
        const user = rows[0]
        console.log(user)        
        if (!user) {
            return res.status(401).json({msg:"Access denied User not found you must be signup.", err:1})
        }
                
        next(); // next allow to continue the traitment in the intial function router
    } catch (error) {
        console.log(error.name)
        if(error.name == 'TokenExpiredError'){
            next()       
        } else {
            res.status(400).json({msg: "Invalid Token."})
        }
        
        
    }
}



