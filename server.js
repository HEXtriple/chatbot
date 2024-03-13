const express = require('express');
const mysql = require('mysql');
const querystring = require('querystring');
const path = require('path');

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'index.html')));

// Skapa en anslutning till MySQL-databasen
// verkligen inte säkert
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chatbot',
  port: 3306
});

con.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

//post html filen på port 3000
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/chatbot', (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  // Här tar servern emot data från förfrågan, sql databasen chatbot med tabellen messages
  req.on('end', () => {
    const post = querystring.parse(body);
    const question = post.message;
    con.query('SELECT response FROM messages WHERE question = ?', [question], (error, results, fields) => {
      if (error) throw error;
      if (results.length > 0) {
        res.json(results[0].response);
      } else {
        res.json('Va? Jag förstår inte vad du menar, kan du formulera dig som en sund människa?');
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
