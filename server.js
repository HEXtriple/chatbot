// Importera nödvändiga moduler
var http = require('http');
var url = require('url');
var mysql = require('mysql');
var querystring = require('querystring');

// Skapa en anslutning till MySQL-databasen
// verkligen inte säkert
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chatbot',
  port: 3306
});

// Anslut till databasen
db.connect();

// Skapa en HTTP-server
const server = http.createServer((req, res) => {
  // Om förfrågan är en POST-förfrågan och sökvägen är '/chatbot'
  if (req.method === 'POST' && url.parse(req.url).pathname === '/chatbot') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    // Här tar servern emot data från förfrågan, sql databasen chatbot med tabellen messages
    req.on('end', () => {
      const post = querystring.parse(body);
      const question = post.message;
      db.query('SELECT response FROM messages WHERE question = ?', [question], (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
          res.end(results[0].response);
        } else {
          res.end('No matching response found in the database.');
        }
      });
    });
  }
});

server.listen(3000);