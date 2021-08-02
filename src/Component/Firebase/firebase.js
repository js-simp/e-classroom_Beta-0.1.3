import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdSQx7MdUo1Y5TZjHRjYp9g3IOBj1wUDo",
  authDomain: "rtcsignalling-63cad.firebaseapp.com",
  projectId: "rtcsignalling-63cad",
  storageBucket: "rtcsignalling-63cad.appspot.com",
  messagingSenderId: "332227590190",
  appId: "1:332227590190:web:82d4afdde5bf13fd9ec7bf",
  measurementId: "G-RNNQTNFDJX"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()
export default db;
