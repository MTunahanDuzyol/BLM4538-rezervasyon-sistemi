let currentUser = null;

export function setAuthUser(user) {
  currentUser = user || null;
}

export function getAuthUser() {
  return currentUser;
}

export function isDemoUser() {
  return Boolean(currentUser?.isDemo);
}

export function isLoggedIn() {
  return Boolean(currentUser);
}

export function clearAuthUser() {
  currentUser = null;
}
