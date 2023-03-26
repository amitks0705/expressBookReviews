const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let userName = req.body.username;
    let passwd = req.body.password;
    console.log("user name " + userName);
    if (isValid(userName))
      return res.status(200).json({message: "User already registered"});
    users.push({"userName":userName, "password": passwd});
    return res.status(200).json({message: "User registered: " + userName});
    
  });
  


 const methCall = new Promise((resolve,reject)=>{
    try {
      const book_list = JSON.stringify(books, null, 4)
      resolve(book_list);
    } catch(err) {
      reject(err)
    }
});

// Get the book list available in the shop
/*
public_users.get('/',function (req, res) {
    methCall.then(
        (book_list) => res.send(book_list),
        (err) => console.log("Error reading file") 
      );
      
});
*/

async function myDisplay(req, res) {
    let myPromise = new Promise(function(resolve, reject) {
        try {
            const book_db = JSON.stringify(books, null, 4)
            resolve(book_db);
         } catch(err) {
            reject(err)
        }
    });
    let book_list = await myPromise;  
    if (book_list) 
        res.send(book_list) 
    else 
        res.status(300).json({message: "No book found"});
  }


// Get the book list available in the shop
public_users.get('/',function (req, res) {
     myDisplay(req, res);
});
  
  // Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    return res.send(books[isbn]);
});

const authorCheck = (authorName, res)=> { //returns boolean
    let authorBook = [];
    console.log("authorCheck : authorName to check validity" + authorName);
    let keyArray = Object.keys(books);
    for (let i = 0; i < keyArray.length; i++) {
        if (books[keyArray[i]].author === authorName) {
            authorBook.push(books[keyArray[i]]);
        }
    }
     if(authorBook.length > 0){
        return res.send(JSON.stringify(authorBook, null, 4));
    } else {
        return res.status(300).json({message: "No book found"});
    }
}

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let authorName = req.params.author;
  authorCheck(authorName, res);
});

const titleCheck = (titleName, res)=> { //returns boolean
    let authorBook = [];
    console.log("authorCheck : titleName to check validity " + titleName);
    let keyArray = Object.keys(books);
    for (let i = 0; i < keyArray.length; i++) {
        console.log("Book Title: " + books[keyArray[i]].title);
        if (books[keyArray[i]].title === titleName) {
            authorBook.push(books[keyArray[i]]);
        }
    }
     if(authorBook.length > 0){
        return res.send(JSON.stringify(authorBook, null, 4));
    } else {
        return res.status(300).json({message: "No book found"});
    }
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let titleName = req.params.title;
  titleCheck(titleName, res);
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbnNum =  req.params.isbn;
    res.send(JSON.stringify(books[isbnNum].reviews));
  //Write your code here
});

module.exports.general = public_users;
