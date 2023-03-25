const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    console.log("Number of users: " + users.length);
    console.log("username to check validity" + username);
    let userswithsamename = users.filter((user)=>{
        console.log("isValid filter userame : " + user.userName);
        return user.userName === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }   
}

const authenticatedUser = (username,password)=>{
    console.log("authentication check # " + users.length + ": user " + username + " password " + password);
    let validusers = users.filter((user)=>{
        console.log("  user: " + username + " password " + password)
        console.log("user match " +  " user " + user.username +
           " user got " + username , "match " + (user.userName === username));
        console.log("password match " + (user.password === password));
        return (user.userName === username && user.password === password)
    });
    console.log("valid user length " + validusers.length);
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.userid=username;
        req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});


// Add a book review
//regd_users.put("/auth/review/:isbn", (req, res) => {
regd_users.put("/review/:isbn", (req, res) => {
  //Write your code here
   let isbn = req.query.isbn;
   let isbn2 = req.body.isbn;
   let reviewText = req.body.review;
   //let username = req.body.username;

   if(req.session.authorization) {
    token = req.session.authorization['accessToken'];
    userSess = req.session.userid;
    console.log("username from session " + userSess);
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            username = userSess;
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }

   //let review = req.body.review;
   console.log("ISBN to add review : " + isbn2);
   console.log("Review added by " + username);
   console.log("Review to add : " + reviewText); 
   book = books[isbn2];
   if (!book.reviews) {
        book.reviews = {};
    }
    book.reviews[username] = reviewText;
    console.log("New review added by user " + username);
    console.log(book.reviews)
    books[isbn2] = book;
    return res.send(JSON.stringify(books[isbn2].reviews, null, 4));

   
   //console.log("Review to add: " + review);
  return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/review/:isbn", (req, res) => {
    let isbn = req.query.isbn;
    let isbn2 = req.body.isbn;
    console.log("ISBN to delete review " + isbn2);
    if(req.session.authorization) {
        token = req.session.authorization['accessToken'];
        userSess = req.session.userid;
        console.log("username from session " + userSess);
        jwt.verify(token, "access",(err,user)=>{
            if(!err){
                username = userSess;
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(403).json({message: "User not logged in"})
     }
     console.log("before deleting books review ISBN " + isbn2 + " username " + username);
     console.log("     " + books[isbn2].reviews[username]);

     if (books[isbn2].reviews[username])
        delete books[isbn2].reviews[username];
    res.status(200).json({message: "review deleted"});
    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
