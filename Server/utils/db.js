import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

// The mysql2 library can directly use the DATABASE_URL from your .env file
const con = mysql.createConnection(process.env.MYSQL_PUBLIC_URL);

con.connect((err) => {
  if (err) {
    console.error('Connection to Railway MySQL failed:', err.stack);
  } else {
    console.log('Successfully connected to Railway MySQL database!');
  }
});


export default con;