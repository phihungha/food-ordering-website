import {
  getAuth,
  EmailAuthProvider,
  GoogleAuthProvider,
  setPersistence,
  inMemoryPersistence,
} from 'firebase/auth';
import { auth } from 'firebaseui';
import { firebaseApp } from './firebase-setup';
import 'firebaseui/dist/firebaseui.css';

const authObj = getAuth(firebaseApp);
setPersistence(authObj, inMemoryPersistence);

async function setupSession(user: any) {
  const idToken = await user.getIdToken();
  const loginReqBody = { idToken };
  await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginReqBody),
  });
  await authObj.signOut();
  window.location.assign('/');
}

const loginUi = new auth.AuthUI(authObj);
const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: (authResult: any) => {
      setupSession(authResult.user);
      const elem = document.getElementById('loading-state');
      if (elem) {
        elem.style.display = 'block';
      }
      return false;
    },
    uiShown: function () {
      const elem = document.getElementById('loading-state');
      if (elem) {
        elem.style.display = 'none';
      }
    },
  },
  signInFlow: 'popup',
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ],
};
loginUi.start('#auth-container', uiConfig);
