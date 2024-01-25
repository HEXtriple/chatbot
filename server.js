const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chatbot'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});