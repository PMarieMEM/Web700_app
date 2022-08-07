/*********************************************************************************
*  WEB700 – Assignment 06

*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: PRECIOUS MARIE E. MALINNAG Student ID: 147010219 Date: JULY 10, 2022
*
*  Online (Github) Link: https://github.com/PMarieMEM/Web700_app.git
   Online (Heruko) Link: https://stormy-anchorage-29789.herokuapp.com/ 
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path")
var exphbs = require('express-handlebars'); //assign 5 update
var app = express();

const collegedata = require('./modules/collegeData')

// Add middleware for static contents
app.use(express.static('views'))
app.use(express.static('modules'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));


//assign 5 update starts here
// setup our requires 
const HTTP_PORT = 8080;
const express = require("express");
const exphbs = require("express-handlebars");

const app = express();
// Register handlebars as the rendering engine for views
app.engine({
    extname: ".hbs", defaultLayout: "main",
    helpers: { equal, navLink },
  })
app.set("view engine", ".hbs");

app.use("/static", express.static(path.join(__dirname, 
    "public")));
app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" +
        (isNaN(route.split("/")[1])
        ? route.replace(/\/(?!.*)/, "")
        : route.replace(/\/(.*)/, ""));
    next();
});

function equal(lvalue, rvalue, options) {
    if (arguments.length < 3)
      throw new Error("Handlebars Helper needs 2 parameters");
    if (lvalue != rvalue) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  }

function navLink(url, options) {
    return ("<li" +
      (url == app.locals.activeRoute
        ? ' class="nav-item active" '
        : ' class="nav-item" ') +
      '><a class="nav-link" href="' +
      url + '">' +
      options.fn(this) +
      "</a></li>"
    );
}  
// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

function handleStudents(req, res) {
    const course = req.query["courseId"];
    if (course) {
      collegeDataModule
        .getStudentsByCourse(course)
        .then(function (response) {
          if (response && response.length) {
            res.render("students", { students: response });
          } else {
            res.render("students", { message: "no results" });
          }
        })
        .catch(function () {
          res.render("students", { message: "no results" });
        });
    } else {
      collegeDataModule
        .getAllStudents()
        .then(function (response) {
          if (response && response.length) {
            res.render("students", { students: response });
          } else {
            res.render("students", { message: "no results" });
          }
        })
        .catch(function () {
          res.render("students", { message: "no results" });
        });
    }
}
//Handles the student route
function handleStudent(req, res) {
    const studentNum = req.params["studentNum"];
    if (studentNum) {
      let viewData = {};
      collegeDataModule
        .getStudentByNum(studentNum)
        .then(function (data) {
          if (data) {
            viewData["student"] = data;
          } else {
            viewData["student"] = null;
          }
        })
        .catch(function () {
          viewData["student"] = null;
        })
        .then(collegeDataModule.getCourses)
        .then(function (coursesData) {
          viewData["courses"] = coursesData;
          for (let i = 0; i < coursesData.length; i++) {
            if (coursesData[i].courseId == viewData.student.course) {
              viewData["courses"][i].selected = true;
            }
          }
        })
        .catch(function () {
          viewData.courses = [];
        })
        .then(function () {
          if (viewData.student == null) {
            res.status(404).send("Student not on the list");
          } else {
            res.render("student", { viewData });
          }
        });
    } else {
      res.status(404).send("Student not on the list");
    }
}
//a function that handles the courses
function handleCourses(req, res) {
    collegeDataModule
      .getCourses()
      .then(function (response) {
        if (response && response.length) {
          res.render("courses", { courses: response });
        } else {
          res.render("courses", { message: "no results" });
        }
      })
      .catch(function () {
        res.render("courses", { message: "no results" });
      });
  }
// funcstion that handles adding student
function handleaddStudent(req, res) {
    const payload = req.body;
    collegeDataModule
      .addStudent(payload)
      .then(function () {
        res.redirect("/students");
      })
      .catch(function () {
        console.log("Error, unable to add the student");
      });
}
//a function that deletes a Student by Student number (studentID)
function handleDeleteStudentById(req, res) {
    const studentNum = req.params["studentNum"];
    collegeDataModule
      .deleteStudent(studentNum)
      .then(function () {
        res.redirect("/students");
      })
      .catch(function () {
        res.status(500).send("Unable to remove the student.");
      });
  }
  
//a function that handles queries by course number (courseID)
function handleCourseById(req, res) {
    const courseId = req.params["courseId"];
    collegeDataModule
      .getCourseById(courseId)
      .then(function (data) {
        if (data) {
          res.render("course", { course: data });
        } else {
          res.status(400).send("Error. Course is not found.");
        }
      })
      .catch(function () {
        res.status(400).send("Error. Course is not found.");
      });
}
// function that lets user delete a course by course number query
function handleDeleteCourseById(req, res) {
    const courseId = req.params["courseId"];
    collegeDataModule
      .deleteCourse(courseId)
      .then(function () {
        res.redirect("/courses");
      })
      .catch(function () {
        res.status(500).send("Unable to remove specified course.");
      });
}

//functions that updates for student update and course update:
function updateStudent(req, res) {
    const payload = req.body;
    collegeDataModule.updateStudent(payload).then(function () {
      res.redirect("/students");
    });
}
function updateCourse(req, res) {
    const payload = req.body;
    collegeDataModule.updateCourse(payload).then(function () {
      res.redirect("/courses");
    });
}
//app.get("/viewData", function(req,res){
//  var someData = {
//       name: "John",
//       age: 23,
//      occupation: "developer",
//      company: "Scotiabank"
//  };
//   res.render('viewData', {
//       data: someData,
//       layout: false // do not use the default Layout (main.hbs)
//  });
//);

// start the server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);
//assign 5 update ends here
    res.render('viewData', {
        data: someData,
        layout: false // do not use the default Layout (main.hbs)
    });

//update for the functions thr handlebars:
app.get("/students", handleStudents);
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
         })
     }   
       });
app.get("/student/:studentNum", handleStudent);
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
app.post("/students/add", handleaddStudent);
app.get("/students/add", (req, res) => {
    collegedata.initialize().then(data => {
        collegedata.getTAs().then(tas => {
        res.send(tas)
        console.log("New student added" )
        }).catch()
})
app.get("/courses", handleCourses);
app.get("/Courses", function(req, res) {   //render update for courses_assign5
    console.log("Entering courses")
    res.render("Courses", { Courses: Courses });
})
app.get("/course/:courseId", handleCourseById);
app.get("/course/delete/:courseId", handleDeleteCourseById);
app.get("/student/delete/:studentNum", handleDeleteStudentById);
app.post("/student/update", updateStudent);
app.post("/course/update", updateCourse);

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

app.get("/about", function (req, res) {
    const about = path.join(__dirname, "./views/home/about.html");
    res.render(about);
});
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
collegeDataModule
  .initialize()
  .then(function () {
    app.listen(HTTP_PORT, () => {
      console.log("server listening on port: " + HTTP_PORT);
    });
  })
  .catch(function (err) {
    console.log(err);
});
});