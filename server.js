const bodyParser = require("body-parser")
express = require("express")
app = express()
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database("./student.db",(err)=>{
    if(err)
        console.log("Error opening db")
    else
        {
            console.log("Db connected!!")
            db.run(`CREATE TABLE IF NOT EXISTS STUDENT(ID INTEGER PRIMARY KEY AUTOINCREMENT, 
                                                       NAME VARCHAR(30) NOT NULL, 
                                                       PHONE VARCHAR(10) UNIQUE NOT NULL)`,
                    (err)=>{
                        if(err)
                            console.log("could not create tables!! ",err)
                        else{
                            console.log("tables created successfully!!")
                        }
            })
        }
})
app.set('views', './templates')
app.set('view engine', 'ejs');
let port = 5000

// function addStudent({name, phone}){
//     try{
    
//     }
// }

app.get("/",(req, res)=>{
    // res.send(`<h1>Welcome to Student Portal`)
    res.render("index")
})

app.get("/home",(req, res)=>{
    res.render("home")
})

app.get("/student/add",(req, res)=>{
    res.render("student_add", {status:0})
})

app.post("/student/add", (req, res)=>{
    console.log("INSIDE")
    name = req.body.name
    phone = req.body.phone
    console.table("BODY",req.body)

    db.run("INSERT INTO STUDENT(ID,NAME,PHONE) VALUES(?,?,?)",[null, name, phone],(err)=>{
        if(err){
            console.log(err)
            res.status(500).render("student_add",{status: err})
        }
        else{
            res.status(200).render("student_add",{status: "success"})
        }
    })
})

app.get("/students", (req, res)=>{
    db.all("select * from student",(err, rows)=>{
        console.log(rows)
        if(err)
            res.render("students", {status: err})
        
        res.render("students", {students: rows})
    })
})
app.listen(port, ()=>{
    console.log(`server started at port ${port}`)
})