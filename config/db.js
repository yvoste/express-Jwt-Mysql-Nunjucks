const mysql = require('mysql2/promise');
// doc https://www.npmjs.com/package/mysql2

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database:process.env.DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const sql1 = 'CREATE TABLE IF NOT EXISTS `user` '
	+ '(`id_user` INT AUTO_INCREMENT PRIMARY KEY,'
	+ ' `email` VARCHAR(255) NOT NULL,'
	+ ' `password` VARCHAR(255) NOT NULL,'
	+ ' `nickname` VARCHAR(60) NOT NULL,'
	+ ' `role` TINYINT(3) NOT NULL,'
	+ ' `date_add` VARCHAR(255),'
	+ ' `date_update` VARCHAR(255),'
	+ ' UNIQUE KEY unique_email (email))'
	+ ' ENGINE = InnoDB DEFAULT CHARSET = utf8'
	// unique key is to prevent duplicate mail

const sql2 = 'CREATE TABLE IF NOT EXISTS `articles` '
	+ '(`id_article` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,'
	+ ' `title` VARCHAR (128),'
	+ ' `content` TEXT NOT NULL,'
	+ ' `author` VARCHAR (60),'
	+ ' `url_img` VARCHAR (255),'
	+ ' `status` TINYINT (3),'
	+ ' `popular` INT (212),'
	+ ' `date_add` DATETIME,'
	+ ' `date_update` DATETIME)'
	+ ' ENGINE = InnoDB  DEFAULT CHARSET = utf8'


 const sql3 ='CREATE TABLE IF NOT EXISTS `comments` '
	+ '(`id_comment` INT AUTO_INCREMENT PRIMARY KEY,'
	+ ' `id_article` INT UNSIGNED NOT NULL,'
	+ ' `comment` VARCHAR (255) NOT NULL,'
	+ ' `author_comment` VARCHAR (60) NOT NULL,'
	+ ' `date_add` DATETIME,'
	+ ' FOREIGN KEY (`id_article`) REFERENCES `articles` (`id_article`) ON DELETE CASCADE)'
	+ ' ENGINE = InnoDB  DEFAULT CHARSET = utf8'

	// foreign key is to link article with comments and to delete comment when deleting article

	const sql4 ='CREATE TABLE IF NOT EXISTS `authuser` '
	+ '(`id_user` INT (11) NOT NULL,'
	+ ' `refreshToken` VARCHAR (255) NOT NULL,'
	+ ' `active` TINYINT (3) NOT NULL,'
	+ ' `date_add` DATETIME,'
	+ ' `date_update` DATETIME,'
	+ ' UNIQUE KEY unique_user (id_user),'
	+ ' FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE)'
	+ ' ENGINE = InnoDB  DEFAULT CHARSET = utf8'

/* 
The foreign key allows to authenticate the refreshtoken with the user and to delete the authenticator when deleting the user.
The active column allows to manage the user, if the administrator sets it to 0 then the user is no longer allowed to connect and when automatic renew of token he will be banned, otherwise it's fine.
*/

async function creating() {
	await pool.execute(sql1)
	await pool.execute(sql2)
	await pool.execute(sql3)
	await pool.execute(sql4)
}

creating()


module.exports =  pool

