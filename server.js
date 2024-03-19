const express = require('express');
const admin = require('firebase-admin');
const app = express();
const path = require('path');

const serviceAccount = require('./key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    await db.collection('data').add({
      username,
      password
    });
    res.redirect('/login');
  } catch (error) {
    console.error('Error storing user data:', error);
    res.status(500).send('Error storing user data');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const userRef = db.collection('data').where('username', '==', username).where('password', '==', password);
      const snapshot = await userRef.get();
  
      if (snapshot.empty) {
        res.send("'Invalid username or password'");
        
      } else {
        res.redirect('/dashboard');
      }
    } catch (error) {
      console.error('Error checking user credentials:', error);
      res.status(500).send('Error checking user credentials');
    }
  });
  
  
app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

app.listen(3000, ()=> console.log("Server is running on port 3000"));