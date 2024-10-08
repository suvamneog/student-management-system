const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "student_app",
  password: "SuvaM123",
});
let getRandomUser = () => {
  return [
    faker.string.uuid(), //id
    faker.person.fullName(), //name
    faker.number.int({ min: 1, max: 1000 }), //rollnumber
    faker.helpers.arrayElement(["Grade 10", "Grade 11", "Grade 12"]), //Class
    faker.helpers.arrayElement(["A", "B", "C", "D", "F"]), //Grade
  ];
};
//show no. of students
app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM users`;
  try {
    connection.query(q,(err,result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
      console.log(count);
    });
  } catch (err) {
    console.log(err);
    res.send("error");
  }
});
//show all students
app.get("/users",(req,res) => {
    let q =`SELECT * FROM users`;
    try {
        connection.query(q,(err,result) => {
            if (err) throw err;
            let user = result;
            res.render("showusers.ejs",{user});   //in showusers.ejs, 'u' is a single user object & 'user' is array of objects of table 'users'
            // console.log(user);
        });
    }
    catch (err) {
        console.log(err);
        res.send("error");
    }
});

//show single student
app.get("/users/:id",(req,res) => {
    let {id} = req.params;
    let q = `SELECT * FROM users WHERE id = ?`;
    try {
        connection.query(q,[id],(err,result) => {
            if (err) throw err;
            let user = result[0];
            res.render("showuser.ejs",{user})
        });
    }
    catch (err) {
        console.log(err);
        res.send("error");
    }
});

app.listen("8080", () => {
  console.log("server is listening to port 8080");
});

//   let q = `INSERT INTO users (id, fullname, rollnumber, class, grade) VALUES ?`;
//   let data =[];
//     for(let i=1; i<=50; i++) {
//         data.push(getRandomUser());
//     }
//   try {
//     connection.query(q,[data],(err,result) => {
//         if (err) throw err;
//         console.log(result);
//     });
//   }
//  catch (err) {
//     console.log(err);
//   }
