const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database:process.env.DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


pool.execute('CREATE TABLE IF NOT EXISTS `user` '
+ '(`id_user` INT AUTO_INCREMENT PRIMARY KEY,'
+ ' `email` VARCHAR(255) NOT NULL,'
+ ' `password` VARCHAR(255) NOT NULL,'
+ ' `nickname` VARCHAR(60) NOT NULL,'
+ ' `role` TINYINT(3) NOT NULL,'
+ ' `date_add` VARCHAR(255),'
+ ' `date_update` VARCHAR(255),'
+ ' UNIQUE KEY unique_email (email))'
+ ' ENGINE = InnoDB DEFAULT CHARSET = utf8')

pool.execute('CREATE TABLE IF NOT EXISTS `articles` '
+ '(`id_article` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,'
+ ' `title` VARCHAR (128),'
+ ' `content` TEXT NOT NULL,'
+ ' `author` VARCHAR (60),'
+ ' `url_img` VARCHAR (255),'
+ ' `status` TINYINT (3),'
+ ' `popular` INT (212),'
+ ' `date_add` DATETIME,'
+ ' `date_update` DATETIME)'
+ ' ENGINE = InnoDB  DEFAULT CHARSET = utf8')

pool.execute('CREATE TABLE IF NOT EXISTS `comments` '
+ '(`id_comment` INT AUTO_INCREMENT PRIMARY KEY,'
+ ' `id_article` INT UNSIGNED NOT NULL,'
+ ' `comment` VARCHAR (255) NOT NULL,'
+ ' `author_comment` VARCHAR (60) NOT NULL,'
+ ' `date_add` DATETIME,'
+ ' FOREIGN KEY (`id_article`) REFERENCES `articles` (`id_article`) ON DELETE CASCADE)'
+ ' ENGINE = InnoDB  DEFAULT CHARSET = utf8')

pool.execute('CREATE TABLE IF NOT EXISTS `authuser` '
+ '(`id_user` INT (11) NOT NULL,'
+ ' `refreshToken` VARCHAR (255) NOT NULL,'
+ ' `active` TINYINT (3) NOT NULL,'
+ ' `date_add` DATETIME,'
+ ' `date_update` DATETIME,'
+ ' UNIQUE KEY unique_user (id_user),'
+ ' FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE)'
+ ' ENGINE = InnoDB  DEFAULT CHARSET = utf8')

module.exports =  pool

