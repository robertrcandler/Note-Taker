// Require dependencies
var http = require("http");
var fs = require("fs");
let jsonfile = "../db/db.json";
//get existing data from db.json file
var jasonrequire = require("../db/db.json");
var jason2 = JSON.stringify(jasonrequire);
var jason = JSON.parse(jason2);
console.log(jason);

// Set our port to 7070
var PORT = 7070;

var server = http.createServer(handleRequest);


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
    jason.table.push({
      Title: titledata, 
      text: textdata
    });
    var jsonobj = JSON.stringify(jason);
    //save to json
    fs.writeFile(jsonfile, jsonobj, function(err) {
      if (err) throw err;
      console.log("Added to file");
    });

    //create page with all the notes
    myHTML =
      "<html><head><title>Saved Notes!</title>" +
      "<style>table {font-family: arial, sans-serif;" +
      "border-collapse: collapse;width: 100%;}" +
      "td, th {border: 1px solid black;text-align: left;"+
      "padding: 8px;}tr:nth-child(even) {"+
      "background-color: gray;}</style>"+
      "</head><body>" +
      "<h1>Saved Notes: </h1>" +
      '<table><tr><th>Title</th><th>Content</th><th>Delete?</th></tr>';
      console.log("B "+JSON.stringify(jason.table[0].Title));
    for (var i=0;i < jason.table.length; i++) {
      var tempTitle = JSON.stringify(jason.table[i].Title);
      var temptext = JSON.stringify(jason.table[i].text);
      //change + with spaces then add to myHTML
      tempTitle.replace("+"," ");
      tempTitle.replace("+"," ");
      myHTML += "<tr><th>" + tempTitle + "</th><th>" +
        temptext + "</th><th>Delete</th></tr>";
    }
    myHTML += "</table></body></html>";
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