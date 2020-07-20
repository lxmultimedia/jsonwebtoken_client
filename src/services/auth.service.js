import axios from "axios";
import store from "../store";
import { router } from "../router";

const API_URL = "http://localhost:3000/api/";

class AuthService {
  login(user) {
    return axios
      .post(API_URL + "login", {
        email: user.username,
        password: user.password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  logout() {
    const user = store.state.auth.user;
    axios.delete(API_URL + "logout", {
      token: user.accessToken,
    });
    localStorage.removeItem("user");
  }
  register(user) {
    return axios.post(API_URL + "register", {
      name: user.username,
      email: user.email,
      password: user.password,
    });
  }
  token(user) {
    return axios.post(API_URL + "token", {
      token: user.refresh,
    });
  }

  createAxiosResponseInterceptor() {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Reject promise if usual error
        if (error.response.status !== 401) {
          return Promise.reject(error);
        }

        /*
         * When response code is 401, try to refresh the token.
         * Eject the interceptor so it doesn't loop in case
         * token refresh causes the 401 response
         */
        axios.interceptors.response.eject(interceptor);

        return axios
          .post(API_URL + "token", {
            token: store.state.auth.user.refreshToken,
          })
          .then((response) => {
            if (response.data.accessToken) {
              store.state.auth.user.accessToken = response.data.accessToken;
              localStorage.setItem(
                "user",
                JSON.stringify(store.state.auth.user)
              );
            }
            return axios(error.response.config);
          })
          .catch((error) => {
            store.dispatch("auth/logout");
            return Promise.reject(error);
          })
          .finally(this.createAxiosResponseInterceptor);
      }
    );
  }
}

export default new AuthService();
