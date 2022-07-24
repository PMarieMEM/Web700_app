/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: PRECIOUS MARIE E. MALINNAG Student ID: 147010219 Date: JULY 10, 2022
*
*  Online (Github) Link: https://github.com/PMarieMEM/Web700_app.git
   Online (Heruko) Link: https://thawing-thicket-87920.herokuapp.com/ 
*
********************************************************************************/ 

// var HTTP_PORT = process.env.PORT || 8080;
//var express = require("express");
//const path = require("path")
//const exphbs = require('express-handlebars'); //assign 5 update
//var app = express();

var collegedata = require('./modules/collegeData')

// Add middleware for static contents
app.use(express.static('views'))
app.use(express.static('modules'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//assign 5 update starts here
// setup our requires 
const HTTP_PORT = 8080;
const express = require("express");
const exphbs = require("express-handlebars");

const app = express();

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// Register handlebars as the rendering engine for views
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.get("/viewData", function(req,res){

    var someData = {
        name: "John",
        age: 23,
        occupation: "developer",
        company: "Scotiabank"
    };

    res.render('viewData', {
        data: someData,
        layout: false // do not use the default Layout (main.hbs)
    });

});

// start the server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);
//assign 5 update ends here
    res.render('viewData', {
        data: someData,
        layout: false // do not use the default Layout (main.hbs)
    });

// Step Get details for students, tas, courses, student num:
app.get("/students", function(req, res) { //render update for students_assign5
    res.render("students", { students: students});
    if( req.query.course &&  req.query.course !== undefined){
        let courseFromParams = req.query.course;
        console.log(courseFromParams);

        collegedata.initialize().then(data => {
            collegedata.getStudentsByCourse(courseFromParams).then(course => {
                res.send(course)
                console.log("courses data retrieved")
            }).catch()
           
        }).catch(err => {
            console.log(err)
        })
    } else {
        collegedata.initialize().then(data => {
            collegedata.getAllStudents().then(students => {
            res.send(students)
            console.log("students suceeded")
            }).catch()
        }).catch(err => {
            err = {
                message : "no results"}
            res.send()
        })
    } 
   
      });

app.get("/tas", (req, res) => {
    collegedata.initialize().then(data => {
        collegedata.getTAs().then(tas => {
        res.send(tas)
        console.log("tas suceeded" )
        }).catch()
    }).catch(err => {
        err = {
            message : "no results"}
        res.send()
    })
})

app.get("/students/add", (req, res) => {
    collegedata.initialize().then(data => {
        collegedata.getTAs().then(tas => {
        res.send(tas)
        console.log("New student added" )
        }).catch()
})

app.get("/Courses", function(req, res) { //render update for courses_assign5
        console.log("Entering courses")
        res.render("Courses", { Courses: Courses });
})

app.get("/student/:studentnum", (req, res) => {
    console.log("Entering student num")
    let studentnumber = req.params.studentnum
        collegedata.initialize().then(data => {
            collegedata.getStudentByNum(studentnumber).then(students => {
                res.send(students)
                console.log("student data retrieved")
            }).catch(err => {
                console.log(err)
            })
           
        }).catch(err => {
            console.log(err)
        })
})

//these GETs are the links to main menu like home, about, html demo
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"./views/home.html"));
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname,"./views/htmlDemo.html"));
});

app.get('*', function(req, res){
    res.send('Page Not Found', 404);
});

//using CollegeData initialize() to HTTP_PORT
collegedata.initialize() 
.then(app.listen(HTTP_PORT, ()=>{
    
    console.log("server listening on port: " + HTTP_PORT)
}))
.catch(err => {
    console.log("Error in intializing...")
})

