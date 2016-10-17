var express = require('express');
var bodyParser = require('body-parser');
var app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
var directory = require('serve-index');


var sqlite3 = require('sqlite3').verbose();


var db = new sqlite3.Database('Northwind.sqlite');

app.set('views', __dirname);
app.set('view engine', 'jade');

app.post('/AjaxQuiz', function(req, res) {
  var strJSON = req.param('strJSON');
  var objJSON = JSON.parse(strJSON);
  var question = objJSON.question;
  var answer = objJSON.answer;
  var respondWith = '';
  switch (question) {
    case "q1":
      if (answer == 2)
        respondWith = "Right";
      else
        respondWith = "Wrong";
      break;
    case "q2":
      if (answer == 3)
        respondWith = "Right";
      else
        respondWith = "Wrong";
      break;
    case "q3":
      if (answer == 1)
        respondWith = "Right";
      else
        respondWith = "Wrong";
      break;
    default:
      respondWith = "failed";
  }
  res.status(200);
  return res.send(respondWith);
});


app.post('/AjaxQuiz-challenge', function(req, res) {
  var strJSON = req.param('strJSON');
  var objJSON = JSON.parse(strJSON);
  var answers = objJSON.answers;
  var correctAnswers = [2, 3, 1];
  var results = {};

  for (var i = 0; i < answers.length; i = i + 1) {
    var q = i + 1;
    if (answers[i] == "x")
      results["q" + q] = "Unanswered";
    else if (answers[i] == correctAnswers[i])
      results["q" + q] = "Right";
    else
      results["q" + q] = "Wrong";
  }

  var respondWith = results;

  res.status(200);
  return res.send(respondWith);
});

app.get('/Employees', function(req, res) {
  db.serialize(function() {
    var NumEmployees = 0;
    db.get("SELECT COUNT(EmployeeID) AS NumEmployees FROM Employees", function(err, row) {
      if (err !== null) {
        res.status(500).send("An error has occurred -- " + err);
      } else {
        NumEmployees = row.NumEmployees;
      }
    });
    res.setHeader('Content-type', 'text/xml');
    db.all("SELECT EmployeeID, FirstName, LastName, Title, BirthDate, HireDate, Extension FROM Employees", function(err, row) {
      if (err !== null) {
        res.status(500).send("An error has occurred -- " + err);
      } else {
        res.render('Employees.xml.jade', {
          employees: row,
          NumEmployees: NumEmployees
        }, function(err, xml) {
          res.status(200).send(xml);
        });
      }
    });
  });
});

app.get('/Shippers', function(req, res) {
  db.serialize(function() {
    var NumShippers = 0;
    db.get("SELECT COUNT(ShipperID) AS NumShippers FROM Shippers", function(err, row) {
      if (err !== null) {
        res.status(500).send("An error has occurred -- " + err);
      } else {
        NumShippers = row.NumShippers;
      }
    });
    res.setHeader('Content-type', 'text/xml');
    db.all("SELECT s.ShipperID, s.CompanyName, s.Phone FROM Shippers s", function(err, row) {
      if (err !== null) {
        res.status(500).send("An error has occurred -- " + err);
      } else {
        res.render('Shippers.xml.jade', {
          shippers: row,
          NumShippers: NumShippers
        }, function(err, xml) {
          res.status(200).send(xml);
        });
      }
    });
  });
});

app.use(directory(__dirname));
app.use(express.static(__dirname));

//listen on port 8080 for webserver:
app.listen(8080);