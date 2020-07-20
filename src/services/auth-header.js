export default function authHeader() {
  let user = JSON.parse(localStorage.getItem("user"));

  if (user && user.accessToken) {
    return { "auth-token": user.accessToken };
  } else {
    return {};
  }
}
