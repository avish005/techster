import "firebase/firestore";
import "firebase/auth";

import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD1tdIt7FdYfScsgCorIm3c208mveY5pnQ",
    authDomain: "techster-2e8be.firebaseapp.com",
    projectId: "techster-2e8be",
    storageBucket: "techster-2e8be.appspot.com",
    messagingSenderId: "221620406350",
    appId: "1:221620406350:web:ae535f6121f2f7c2f01b1f"
  };
let app;

if(firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export{ db, auth };