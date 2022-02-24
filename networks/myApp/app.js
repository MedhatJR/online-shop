var express = require("express");
var path = require("path");
const { addListener, nextTick, config } = require("process");
var app = express();
var fs = require("fs");
const { json } = require("express");
let alert = require("alert");
//let a = require("alert");
var session = require("express-session");
//var popup = require("popups");
//GLOBAL.document = new JSDOM(html).window.document;
//const dotenv = require("dotenv");
//dotenv.config();
app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { max: 10 },
    resave: false,
  })
);
//const searchbar = document.getElementsByName('search')

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.get('/', function (req, res) {
//   res.render('index', { title: "express" })/*title is optional, it is used if we want to pass variables to the frontend*/
// });
// app.get('/pizza', function (req, res) {
//   res.render('pizzaPage',{ppp: "ddd"})
// });
// app.post('/pizza', function (req, res) {
//   var x = req.body.user;
//   var y = req.body.pass;
//   console.log(x + " " + y);
// });

//Mongo Atlas
async function main() {
  var { MongoClient } = require("mongodb");
  var url =
    "mongodb+srv://admin:admin@cluster0.5hhkd.mongodb.net/firstdb?retryWrites=true&w=majority";
  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

  //var user = {username:'user1', password: 'pass1'};
  //await client.db('firstdb').collection('firstcollection').insertOne(user);
  var output = await client
    .db("firstdb")
    .collection("firstcollection")
    .find()
    .toArray();

  //console.log(output);
  client.close();
}
main().catch(console.error);

// login
app.get("/", function (req, res) {
  res.render("login");
});
app.post("/", async function (req, res) {
  //var y = req.body.password

  var { MongoClient } = require("mongodb");
  var url =
    "mongodb+srv://admin:admin@cluster0.5hhkd.mongodb.net/firstdb?retryWrites=true&w=majority";
  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  //await client.db('firstdb').collection('firstcollection').find();
  var output = await client
    .db("firstdb")
    .collection("firstcollection")
    .find()
    .toArray();
  var outLength = output.length;
  //console.log(output);
  var x = req.body.username;
  var y = req.body.password;
  req.session.username = x;
  var z = [];
  req.session.cart = z;
  req.session.save();
  //console.log(req.session.cart);
  var user = { username: x, password: y, cart: z };
  for (var i = 0; i < outLength; i++) {
    if ((x == output[i].username) & (y == output[i].password)) {
      //alert('login succssful');
      res.render("home");
      return;
      i = i + outLength;
    } else if (i == outLength - 1) {
      throw new Error('LOGIN FAILED');
    //  res.writeHead(200, { 'Content-Type': 'application/text' }); 
     // res.end('Login Failed');
    //     content: 'wrong username or password!'
    // });
     //  alert("Wrong username or password");
      // res.send(
      // '<script>alert("Wrong username or password."); window.location.href = "/"; </script>'
      // );
      // document.getElementById("loginReg").style.display = "block";
    }
  }

  client.close();

  main().catch(console.error);
});
/*registration*/
app.get("/registration", function (req, res) {
  res.render("registration");
});
app.post("/register", async function (req, res) {
  var x = req.body.username;
  var y = req.body.password;
  var z = [];
  console.log(x);
  console.log(y);
  var { MongoClient } = require("mongodb");
  var url =
    "mongodb+srv://admin:admin@cluster0.5hhkd.mongodb.net/firstdb?retryWrites=true&w=majority";
  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var output = await client
    .db("firstdb")
    .collection("firstcollection")
    .find()
    .toArray();
  var user = { username: x, password: y, cart: z };

  for (var i = 0; i < output.length; i++) {
    if (x == output[i].username) {
      res.send(
        '<script>alert("Username is already taken."); window.location.href = "/registration"; </script>'
      );
      i = i + output.length;
    }
  }
  if (i == output.length) {
    if ((x != "") & (y != "")) {
      alert("success");
      await client.db("firstdb").collection("firstcollection").insertOne(user);
    }
  } else {
    res.send(
      '<script>alert("Please enter a valid username or password."); window.location.href = "/registration"; </script>'
    );
  }

  //console.log(output);
  client.close();
  main().catch(console.error);
});

app.get("/home", function (req, res) {
  res.render("home");
});
// app.get("/cart", function (req, res) {
//   res.render("cart");
// });

app.post("/view_cart", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var url =
    "mongodb+srv://admin:admin@cluster0.5hhkd.mongodb.net/firstdb?retryWrites=true&w=majority";
  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var output = await client
    .db("firstdb")
    .collection("firstcollection")
    .find()
    .toArray();

  console.log("here2");
  console.log(req.session.username);
  var cartRes = [];
  for (var m = 0; m < output.length; m++) {
    if (req.session.username == output[m].username) {
      console.log("gg");
      cartRes = output[m].cart;
      m = m + output.length;
    }
  }
  console.log(cartRes);
  res.render("cart", { x: cartRes });
  // console.log(x);
});

app.get("/phones", function (req, res) {
  res.render("phones");
});

app.get("/books", function (req, res) {
  res.render("books");
});

app.get("/sports", function (req, res) {
  res.render("sports");
});

app.get("/iphone", function (req, res) {
  res.render("iphone");
});

app.get("/galaxy", function (req, res) {
  res.render("galaxy");
});

app.get("/leaves", function (req, res) {
  res.render("leaves");
});

app.get("/boxing", function (req, res) {
  res.render("boxing");
});

app.get("/sun", function (req, res) {
  res.render("sun");
});

app.get("/tennis", function (req, res) {
  res.render("tennis");
});

app.post("/Search", function (req, res) {
  var x = req.body.Search;
  var array = [
    "Galaxy S21 Ultra",
    "iPhone 13 Pro",
    "Leaves of Grass",
    "The Sun and Her Flowers",
    "Boxing Bag",
    "Tennis Racket",
  ];
  var result = [];

  var j = 0;
  for (var i = 0; i < array.length; i++) {
    if (x == ""){
      
    }else{
    if (array[i].toLowerCase().includes(x.toLowerCase())) {
      result[j] = array[i];
      j++;
      
    }
  }}
 
  res.render("searchresults", { xy: result });
  
});


app.post("/iphone", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var url =
    "mongodb+srv://admin:admin@cluster0.5hhkd.mongodb.net/firstdb?retryWrites=true&w=majority";
  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var output = await client
    .db("firstdb")
    .collection("firstcollection")
    .find()
    .toArray();
  console.log("here0");
  console.log(output);

  console.log("here1");
  console.log(req.session.username);

  console.log("here2");
  console.log(req.session.username);
  //console.log(req.session.cart);
  for (var m = 0; m < output.length; m++) {
    if (req.session.username == output[m].username) {
      console.log("gg");
      var z = output[m].cart;
      m = m + output.length;
    }
  }

  var x = 0;
  while (x < z.length) {
    console.log("ffscgd");
    if (z[x] == "iPhone 13 Pro") {
      console.log("ff");
      alert("item already exists in your cart");
      break;
    } else {
      x++;
      console.log("ll");
    }
  }
  if (x == z.length) {
    var r = z;
    r.push("iPhone 13 Pro");
    console.log(r);
    alert("item added successfully");
    var p = await client
      .db("firstdb")
      .collection("firstcollection")
      .update({ username: req.session.username }, { $set: { cart: r } });
    // console.log();
  }
});
app.post("/galaxy", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var url =
    "mongodb+srv://admin:admin@cluster0.5hhkd.mongodb.net/firstdb?retryWrites=true&w=majority";
  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var output = await client
    .db("firstdb")
    .collection("firstcollection")
    .find()
    .toArray();
  console.log("here0");
  console.log(output);

  console.log("here1");
  console.log(req.session.username);

  console.log("here2");
  console.log(req.session.username);
  console.log(req.session.cart);
  for (var m = 0; m < output.length; m++) {
    if (req.session.username == output[m].username) {
      console.log("gg");
      var z = output[m].cart;
      m = m + output.length;
    }
  }

  var x = 0;
  while (x < z.length) {
    console.log("ffscgd");
    if (z[x] == "Galaxy S21 Ultra") {
      console.log("ff");
      alert("item already exists in your cart");
      break;
    } else {
      x++;
      console.log("ll");
    }
  }
  if (x == z.length) {
    var r = z;
    r.push("Galaxy S21 Ultra");
    console.log(r);
    alert("item added successfully");
    var p = await client
      .db("firstdb")
      .collection("firstcollection")
      .update({ username: req.session.username }, { $set: { cart: r } });
    // console.log();
  }
});
app.post("/leavess", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var url =
    "mongodb+srv://admin:admin@cluster0.5hhkd.mongodb.net/firstdb?retryWrites=true&w=majority";
  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var output = await client
    .db("firstdb")
    .collection("firstcollection")
    .find()
    .toArray();
  console.log("here0");
  console.log(output);

  console.log("here1");
  console.log(req.session.username);

  console.log("here2");
  console.log(req.session.username);
  console.log(req.session.cart);
  for (var m = 0; m < output.length; m++) {
    if (req.session.username == output[m].username) {
      console.log("gg");
      var z = output[m].cart;
      m = m + output.length;
    }
  }

  var x = 0;
  while (x < z.length) {
    console.log("ffscgd");
    if (z[x] == "Leaves of Grass") {
      console.log("ff");
      alert("item already exists in your cart");
      break;
    } else {
      x++;
      console.log("ll");
    }
  }
  if (x == z.length) {
    var r = z;
    r.push("Leaves of Grass");
    console.log(r);
    alert("item added successfully");
    var p = await client
      .db("firstdb")
      .collection("firstcollection")
      .update({ username: req.session.username }, { $set: { cart: r } });
    // console.log();
  }
});
app.post("/sunand", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var url =
    "mongodb+srv://admin:admin@cluster0.5hhkd.mongodb.net/firstdb?retryWrites=true&w=majority";
  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var output = await client
    .db("firstdb")
    .collection("firstcollection")
    .find()
    .toArray();
  console.log("here0");
  console.log(output);

  console.log("here1");
  console.log(req.session.username);

  console.log("here2");
  console.log(req.session.username);
  console.log(req.session.cart);
  for (var m = 0; m < output.length; m++) {
    if (req.session.username == output[m].username) {
      console.log("gg");
      var z = output[m].cart;
      m = m + output.length;
    }
  }

  var x = 0;
  while (x < z.length) {
    console.log("ffscgd");
    if (z[x] == "The Sun and Her Flowers") {
      console.log("ff");
      alert("item already exists in your cart");
      break;
    } else {
      x++;
      console.log("ll");
    }
  }
  if (x == z.length) {
    var r = z;
    r.push("The Sun and Her Flowers");
    console.log(r);
    alert("item added successfully");
    var p = await client
      .db("firstdb")
      .collection("firstcollection")
      .update({ username: req.session.username }, { $set: { cart: r } });
    // console.log();
  }
});
app.post("/boxingg", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var url =
    "mongodb+srv://admin:admin@cluster0.5hhkd.mongodb.net/firstdb?retryWrites=true&w=majority";
  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var output = await client
    .db("firstdb")
    .collection("firstcollection")
    .find()
    .toArray();
  console.log("here0");
  console.log(output);

  console.log("here1");
  console.log(req.session.username);

  console.log("here2");
  console.log(req.session.username);
  console.log(req.session.cart);
  for (var m = 0; m < output.length; m++) {
    if (req.session.username == output[m].username) {
      console.log("gg");
      var z = output[m].cart;
      m = m + output.length;
    }
  }

  var x = 0;
  while (x < z.length) {
    console.log("ffscgd");
    if (z[x] == "Boxing Bag") {
      console.log("ff");
      alert("item already exists in your cart");
      break;
    } else {
      x++;
      console.log("ll");
    }
  }
  if (x == z.length) {
    var r = z;
    r.push("Boxing Bag");
    console.log(r);
    alert("item added successfully");
    var p = await client
      .db("firstdb")
      .collection("firstcollection")
      .update({ username: req.session.username }, { $set: { cart: r } });
    // console.log();
  }
});
app.post("/tenniss", async function (req, res) {
  var { MongoClient } = require("mongodb");
  var url =
    "mongodb+srv://admin:admin@cluster0.5hhkd.mongodb.net/firstdb?retryWrites=true&w=majority";
  var client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  var output = await client
    .db("firstdb")
    .collection("firstcollection")
    .find()
    .toArray();
  console.log("here0");
  console.log(output);

  console.log("here1");
  console.log(req.session.username);

  console.log("here2");
  console.log(req.session.username);
  console.log(req.session.cart);
  for (var m = 0; m < output.length; m++) {
    if (req.session.username == output[m].username) {
      console.log("gg");
      var z = output[m].cart;
      m = m + output.length;
    }
  }

  var x = 0;
  while (x < z.length) {
    console.log("ffscgd");
    if (z[x] == "Tennis Racket") {
      console.log("ff");
      alert("item already exists in your cart");
      break;
    } else {
      x++;
      console.log("ll");
    }
  }
  if (x == z.length) {
    var r = z;
    r.push("Tennis Racket");
    console.log(r);
    alert("item added successfully");
    var p = await client
      .db("firstdb")
      .collection("firstcollection")
      .update({ username: req.session.username }, { $set: { cart: r } });
    // console.log();
  }
});
if (process.env.PORT) {
  app.listen(process.env.PORT, function () {
    console.log("server started");
  });
} else {
  app.listen(8000, function () {
    console.log("server started on port 8000");
  });
}
//app.listen(3000);
