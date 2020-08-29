let express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    flash = require("connect-flash"),
    User = require("./models/user.js"),
    app = express();

let port = process.env.PORT;
mongoose.connect('mongodb+srv://Saswat:Password1234@cluster0.6jh4b.mongodb.net/opencode_test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(flash())

app.use(require("express-session")({
    secret: "Secret",
    resave: false,
    saveUninitialized: false
}))

app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next()
})

app.get("/", (req, res) => {
    res.render("landing")
})

app.get("/home", (req, res) => {
    res.render("home")
})

app.post("/home", (req, res) => {
    let name = req.body.name;
    let rollno = req.body.rollno;
    rollno = rollno.toUpperCase();
    let newUser = {name: name, rollno: rollno}
    User.find({}, (err, users) => {
        if (err) {
            console.log(err)
            res.redirect("/home")
        } else {
            var n = 0
            users.forEach((user) =>{
                    if (user.rollno === rollno) {
                        n = 1

                }
            })
            if (n === 1) {
                req.flash("error", "Entry already exists")
                res.redirect("/home")
            } else {
                User.create(newUser, (err) => {
                    if (err) {
                        console.log(err.message);
                    } else {
                        req.flash("success", "Added entry")
                        res.redirect("/home");
                    }
                })
            }
        }
    })
})

app.get("/index", (req, res) => {
    User.find({}).sort({rollno: 1}).exec((err, users) =>{
        if (err) {
            console.log(err);
        } else {
            res.render("index", {users: users})
        }
    })
})

app.listen(port, process.env.IP, () => {
    console.log("Server started");
})