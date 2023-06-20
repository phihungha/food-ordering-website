import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from './firebase-setup';
document
  .querySelector('#product-search-box')
  ?.addEventListener('keyup', async (e) => {
    const event = e as KeyboardEvent;
    if (event.key !== 'Enter') {
      return;
    }
    const elem = event.target as HTMLInputElement;
    if (elem.value) {
      window.location.assign(`/products?search=${elem.value}`);
    } else {
      window.location.assign(`/products`);
    }
  });

document.querySelector('#sign-out-btn')?.addEventListener('click', async () => {
  await getAuth(firebaseApp).signOut();
  window.location.reload();
});

function displayNavbar(query: string, display: boolean) {
  const navbar = document.querySelector(query);
  if (display) {
    navbar?.classList.add('navbar-link-list');
    navbar?.classList.remove('hidden');
  } else {
    navbar?.classList.add('hidden');
    navbar?.classList.remove('navbar-link-list');
  }
}

function changeNavbarMode(loggedIn: boolean) {
  if (loggedIn) {
    displayNavbar('#logged-in-navbar', true);
    displayNavbar('#logged-out-navbar', false);
  } else {
    displayNavbar('#logged-out-navbar', true);
    displayNavbar('#logged-in-navbar', false);
  }
}

function setupLoggedInNavbar(userDisplayName: string | null) {
  changeNavbarMode(true);
  const currentUserNameElem = document.querySelector('#currentUserName');
  if (currentUserNameElem) {
    currentUserNameElem.textContent = userDisplayName;
  }
}

function setupNonLoggedInNavbarUI() {
  changeNavbarMode(false);
  const currentUserNameElem = document.querySelector('#currentUserName');
  if (currentUserNameElem) {
    currentUserNameElem.textContent = '';
  }
}

onAuthStateChanged(getAuth(firebaseApp), (user) => {
  if (user) {
    setupLoggedInNavbar(user.displayName);
  } else {
    setupNonLoggedInNavbarUI();
  }
});
