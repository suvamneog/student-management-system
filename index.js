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
//add student page
app.get("/users/add",(req,res) => {
    let randomId = faker.string.uuid();
    res.render("add.ejs",{ id: randomId });
});

//submit add student
app.post("/users/add",(req,res) => {
    let {id, fullname, rollnumber, class: userClass, grade} = req.body;
    let q = `INSERT INTO users (id, fullname, rollnumber, \`class\`, grade) VALUES (?, ?, ?, ?, ?)`;
try {
    connection.query(q,[id, fullname, rollnumber ,userClass, grade],(err,result) => {
        if (err) throw err;
        res.redirect("/users");
        console.log(result);
    } )
}
catch(err) {
console.log(err);
res.send("error");
}
});



//edit student page
app.get("/users/:id/edit",(req,res) => {
    let {id}=req.params;
    let q = `SELECT * FROM users WHERE id = ?`;
    try {
        connection.query(q,[id],(err,result)=> {
            if (err) throw err;
            let user=result[0]
            res.render("edit.ejs",{user});
        });
    }
    catch (err) {
        console.log(err);
        res.send("error");
    }
});

//submit edit student
app.post("/users/:id",(req,res) => {
    let {id} = req.params;
    let {fullname : newFullName, rollnumber : newRollNumber, class : newUserClass, grade: newUserGrade} = req.body;
    let q = `SELECT * FROM users WHERE id = ?`;
    try {
        connection.query(q,[id],(err,result) => {
            let user=result[0];
            if (err) throw err;
            if (newRollNumber != user.rollnumber) {
                res.send("Student not found");
            } 
            else {
                let q2 ='UPDATE users SET fullname = ?, rollnumber = ?, `class` = ?, grade = ? WHERE id = ?';
            connection.query(q2,[newFullName,newRollNumber,newUserClass,newUserGrade,id],(req,result)=> {
                res.redirect("/users");
            });
        }
    });
}
catch (err) {
console.log(err);
res.send("error");
}
}); 



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
            console.log(user);
        });
    }
    catch (err) {
        console.log(err);
        res.send("error");
    }
});

//Student delete page
app.get("/users/:id/delete",(req,res) => {
    let {id}=req.params;
    let q = `SELECT * FROM users WHERE id = ?`;
    try {
        connection.query(q,[id],(err,result) => {
            if (err) throw err;
            let user = result[0];
            res.render("delete.ejs",{user});
        });
    }
    catch(err) {
        console.log(err);
        res.send("error");
    }
});

//submit delete form
app.delete("/users/:id",(req,res)=> {
    let {id}=req.params;
    let{rollnumber:rollNumber}=req.body;
    let q=`SELECT * FROM users WHERE id = ?`;
    try {
        connection.query(q,[id],(err,result)=> {
            let user=result[0];
            if (err) throw err;
            if(rollNumber != user.rollnumber) {
                res.send("Wrong roll number!");
            }
            else {
                let q2 =`DELETE FROM users WHERE id = ?`;
                connection.query(q2,[id],(err,result) => {
                    res.redirect("/users");
                    console.log(result);
                })
                
            }
        });
    }
        catch(err) {
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
