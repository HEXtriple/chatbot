var http = require('http');
var url = require('url');
var mysql = require('mysql');
var querystring = require('querystring');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chatbot',
  port: 3306
});


db.connect();


const server = http.createServer((req, res) => {
  if (req.method === 'POST' && url.parse(req.url).pathname === '/chatbot') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const post = querystring.parse(body);
      const question = post.message;
      db.query('SELECT response FROM messages WHERE question = ?', [question], (error, results, fields) => {
        if (error) throw error;
        res.end(results[0].response);
      });
    });
  }
});

server.listen(3000); //Standarport är redan använd av något annat program, därför väljer vi 3000 istället