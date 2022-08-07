const Sequalize = require("sequelize");

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}
var sequelize = new Sequelize("database", "user", "password", {
    host: "gost", dialect: "postgres", port: 5432, dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  });
  
var Student = sequelize.define("Student", {
    studentNum: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN, status: Sequelize.STRING,
});
  
var Course = sequelize.define("Course", {
    courseId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING,
});
  
  Course.hasMany(Student, { foreignKey: "course" });
function initialize() {
    return new Promise(function (resolve, reject) {
      sequelize
        //.sync({ force: true })
        .sync()
        .then(function () {
          resolve("Operation was a success");
        })
        .catch(function () {
          reject("Unable to sync the database");
        });
    });
}
  
function getAllStudents() {
    return new Promise(function (resolve, reject) {
      Student.findAll()
        .then(function (students) {
          resolve(students);
        })
        .catch(function () {
          reject("no results returned");
        });
    });
}
  
function getStudentsByCourse(course) {
    console.log(typeof course);
    return new Promise(function (resolve, reject) {
      Student.findAll({
        where: {
          course,
        },
      })
        .then(function (students) {
          resolve(students);
        })
        .catch(function () {
          reject("no results returned");
        });
    });
}
  
function getStudentByNum(studentNum) {
    return new Promise(function (resolve, reject) {
      Student.findAll({
        where: {
          studentNum,
        },
      })
        .then(function (students) {
          resolve(students[0]);
        })
        .catch(function () {
          reject("no results returned");
        });
    });
}
  
function getCourses() {
    return new Promise(function (resolve, reject) {
      Course.findAll()
        .then(function (courseList) {
          resolve(courseList);
        })
        .catch(function () {
          reject("no results returned");
        });
    });
}
  
function getCourseById(courseId) {
    return new Promise(function (resolve, reject) {
      Course.findAll({
        where: {
          courseId,
        },
      })
        .then(function (courseList) {
          resolve(courseList[0]);
        })
        .catch(function () {
          reject("no results returned");
        });
    });}
  
function addStudent(studentData) {
    return new Promise(function (resolve, reject) {
      const payload = {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        addressStreet: studentData.addressStreet,
        addressCity: studentData.addressCity,
        addressProvince: studentData.addressProvince,
        TA: studentData.TA ? true : false,
        status: studentData.status,
        course: studentData.course,
      };
      for (let key in payload) {
        if (payload[key] == "") {
          payload[key] = null;
        }
      }
      Student.create(payload)
        .then(function () {
          resolve("Successfully added");
        })
        .catch(function () {
          reject("Unable to create student");
        });
    });
}
  
function updateStudent(studentData) {
    return new Promise(function (resolve, reject) {
      const payload = {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        addressStreet: studentData.addressStreet,
        addressCity: studentData.addressCity,
        addressProvince: studentData.addressProvince,
        TA: studentData.TA ? true : false,
        status: studentData.status,
        course: studentData.course,
      };
      for (let key in payload) {
        if (payload[key] == "") {
          payload[key] = null;
        }
      }
      Student.update(payload, {
        where: { studentNum: studentData.studentNum },
      })
        .then(function () {
          resolve("Successfully updated");
        })
        .catch(function () {
          reject("Unable to update student");
        });
    });
}
  
function addCourse(course) {
    console.log(course);
    return new Promise(function (resolve, reject) {
      const payload = {
        courseCode: course.courseCode,
        courseDescription: course.courseDescription,
      };
      for (let key in payload) {
        if (payload[key] == "") {
          payload[key] = null;
        }
      }
      Course.create(payload)
        .then(function () {
          resolve("Course Successfully added");
        })
        .catch(function () {
          reject("Unable to create course");
        });
    });
}
  
let dataCollection = null;

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile('./data/courses.json','utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile('./data/students.json','utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(dataCollection.students);
    })
}

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].TA == true) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataCollection.courses.length == 0) {
        reject("query returned 0 results"); return;
    }

    resolve(dataCollection.courses);
   });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;
        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results"); return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};
module.exports = {
    initialize,
    getAllStudents,
    getCourses,
    getStudentByNum,
    getStudentsByCourse,
    addStudent,
    addCourse,
    getCourseById,
    updateStudent,
  };
