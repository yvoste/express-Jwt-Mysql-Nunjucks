# express-Jwt-Mysql-Nunjucks

All the code commented for all the explanation.
Used in project:
- bcrypt for hash password and create xrsToken, 
- cookie-parser to read cookies (two cookies, acces_token and refresh_Token), 
- dotenv to create a file .env with the configug variables
- express for the server,
- joi to valide the fields before insert in server
- jsonwebtoken for creatde the tokens
- morgan for read the requests and logs  in the terminal
- multer for the uploading images
- mysql2 for connecting with the database
- nunjucks for templating

To installing you must have access to mysql (phpmyAdmin or other)



## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Installation](#installation)
4. [Collaboration](#collaboration)
5. [FAQs](#faqs)
### General Info
***
Private Blog for an entreprise.
***
The users of the blog must be registered and then have the right to read the published messages, but also to write them.
### Screenshot
![Image text](https://zupimages.net/viewer.php?id=21/30/5y08.png)
## Technologies
***
A list of technologies used within the project:
***
- bcrypt for hash password and create xrsToken, 
- cookie-parser to read cookies (two cookies, acces_token and refresh_Token), 
- dotenv to create a file .env with the configug variables
- express for the server,
- joi to valide the fields before insert in server
- jsonwebtoken for creatde the tokens
- morgan for read the requests and logs  in the terminal
- multer for the uploading images
- mysql2 for connecting with the database
- nunjucks for templating
## Installation
***
Important: you must install a mysql database (current name p7 see .env file) before launching the application otherwise it will not be able to install the necessary tables (see config/db.js file) then it crashed
***
$ git clone https://github.com/yvoste/express-Jwt-Mysql-Nunjucks.git
$ npm install
$ create sql data base in phpMyAdmin (name of DB: p7 see file .env)
$ node index.js (nodemon index.js)
```
Side information: To use the application:

You can find in file .env all variables necessary.

The rights are different according to the user.
***
Administrator : to create an administrator user, you must use the nickname when you register : admin
The rights of the administrator are the following: authorization of publication and suppression of articles.
***
Moderator: to create an administrator user, you must use the nickname when you register : mod
The rights of the moderator are: deletion of articles
***
Other user are standard rights: write, comments and read.
***
When the user registers or logs in, he stays logged in, the access token is renewed automatically as long as the refresh token is valid (see the duration in the .env file).
***
 The administrator can changed his status in the backend from active to inactive, then he is unconnected. This feature allows to manage users

