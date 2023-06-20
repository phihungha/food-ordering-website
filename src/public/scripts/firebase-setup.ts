import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBQderpr99k8SUSrY3oiXCmRLNENcSTq68',
  authDomain: 'abc-fos.firebaseapp.com',
  projectId: 'abc-fos',
  storageBucket: 'abc-fos.appspot.com',
  messagingSenderId: '326658494571',
  appId: '1:326658494571:web:96669dcf8537ba6a9de12e',
};

export const firebaseApp = initializeApp(firebaseConfig);
