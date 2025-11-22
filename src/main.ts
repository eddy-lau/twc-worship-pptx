import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import firebase from 'firebase/app';
//import 'firebase/analytics';

var firebaseConfig = {
    apiKey: "AIzaSyD82Fj6-PkcMTD3IQ7w1631t5XpBwpNJRY",
    authDomain: "twc-worship-pptx.firebaseapp.com",
    projectId: "twc-worship-pptx",
    storageBucket: "twc-worship-pptx.appspot.com",
    messagingSenderId: "406134015845",
    appId: "1:406134015845:web:c85594772c56dde54cc38c",
    measurementId: "G-87L3WCNQLV"
};

firebase.initializeApp(firebaseConfig);
//firebase.analytics();

createApp(App).mount('#app')

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/twc-worship-pptx/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
