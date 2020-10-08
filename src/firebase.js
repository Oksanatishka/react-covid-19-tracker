import firebase from 'firebase';

const firebaseConfig = {
    apiKey: 'AIzaSyDJaVLuYlkNbdFBCGTpIroApTc8S62q5aA',
    authDomain: 'covid-19-tracker-project-efc17.firebaseapp.com',
    databaseURL: 'https://covid-19-tracker-project-efc17.firebaseio.com',
    projectId: 'covid-19-tracker-project-efc17',
    storageBucket: 'covid-19-tracker-project-efc17.appspot.com',
    messagingSenderId: '695032274093',
    appId: '1:695032274093:web:60a26748b4bb2f6fdd7a24',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
