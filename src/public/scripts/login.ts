import { getAuth, EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { auth } from 'firebaseui';
import { firebaseApp } from './firebase-setup';
import 'firebaseui/dist/firebaseui.css';

const loginUi = new auth.AuthUI(getAuth(firebaseApp));
const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: () => true,
    uiShown: function () {
      const elem = document.getElementById('loading-state');
      if (elem) {
        elem.style.display = 'none';
      }
    },
  },
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ],
};
loginUi.start('#auth-container', uiConfig);
