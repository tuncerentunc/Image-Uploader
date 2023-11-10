import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA84rZYcIAfTzNf3DFSjGhHFUd36x001xQ",
    authDomain: "depixen-casestudy-a8e48.firebaseapp.com",
    databaseURL:
        "https://depixen-casestudy-a8e48-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "depixen-casestudy-a8e48",
    storageBucket: "depixen-casestudy-a8e48.appspot.com",
    messagingSenderId: "625399515715",
    appId: "1:625399515715:web:7667997013fa7786fde2f6",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

export { storage, database };
