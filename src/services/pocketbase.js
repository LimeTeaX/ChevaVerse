const PB_URL = import.meta.env.VITE_PB_URL || 'http://localhost:8090';

export async function signUp(email, password, passwordConfirm) {
  const res = await fetch(`${PB_URL}/api/collections/users/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, passwordConfirm })
  });
  return res.json();
}

export async function signIn(email, password) {
  const res = await fetch(`${PB_URL}/api/collections/users/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: email, password })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('pb_token', data.token);
    localStorage.setItem('pb_user', JSON.stringify(data.record));
  }
  return data;
}

export function signOut() {
  localStorage.removeItem('pb_token');
  localStorage.removeItem('pb_user');
}

export function getUser() {
  const user = localStorage.getItem('pb_user');
  return user ? JSON.parse(user) : null;
}