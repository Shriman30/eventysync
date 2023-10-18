// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getReactNativePersistence, initializeAuth} from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3QTk1nya9rR7etGrbBluXDXwer2giaMA",
  authDomain: "eventsync-a83bc.firebaseapp.com",
  databaseURL: "https://eventsync-a83bc-default-rtdb.firebaseio.com",
  projectId: "eventsync-a83bc",
  storageBucket: "eventsync-a83bc.appspot.com",
  messagingSenderId: "236682979010",
  appId: "1:236682979010:web:44e64780365cc835127d5b"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(app,{persistence:getReactNativePersistence(ReactNativeAsyncStorage)})
export const db = getFirestore(app);