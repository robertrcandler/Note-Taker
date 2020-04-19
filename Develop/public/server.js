// Require dependencies
var http = require("http");
var fs = require("fs");
let jsonfile = "../db/db.json";

// Set our port to 7070
var PORT = 7070;

var server = http.createServer(handleRequest);

//make object with table array for db.json
var obj = {table: []};

function handleRequest(req, res) {

  // path is url
  var path = req.url;
  
  // switch between index and notes page
  switch (path) {

  case "/notes":
    return renderHTML(path + ".html", res);
  case "/returned":
      return renderNote(req, res);

  default:
    return renderHTML("/index.html", res);
  }
}

// function chooses to put out html pages
function renderHTML(filePath, res) {
  return fs.readFile(__dirname + filePath, function(err, data) {
    if (err) throw err;
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
}

//function saves input text as note in db
function renderNote(req, res) {
  // Saving the request posted data as a variable.
  var requestData = "";

  var myHTML =
    "<html><head><title>Something Went Wrong!</title></head><body><h1>Data has not been received!</h1></body></html>";

  // When the server receives data, it will add it to requestData.
  req.on("data", function(data) {
    requestData += data;
    console.log("You just posted some data to the server:\n", requestData);
    //stringify the captured text, seperate it and save to seperate variables
    var titledata = requestData.substring(
      requestData.lastIndexOf("title=") + 6,
      requestData.lastIndexOf("&text"));
    var textdata = requestData.substring(
      requestData.lastIndexOf("text=") + 5);
    //add saved data to table object
    obj.table.push({Title: titledata, text: textdata});
    var jsonobj = JSON.stringify(obj);
    //save to json
    fs.appendFile(jsonfile, jsonobj, function(err) {
      if (err) throw err;
      console.log("Added to file");
    });
    myHTML =
      "<html><head><title>Hello Noder!</title></head><body>" +
      "<h1>Thank you for the data: </h1><code>" +
      requestData +
      "</code>" +
      "</body></html>";
  });

  // When the request has ended...
  req.on("end", function() {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(myHTML);
  });
}

// Starts our server.
server.listen(PORT, function() {
  console.log("Server is listening on PORT: http://localhost:" + PORT);
});