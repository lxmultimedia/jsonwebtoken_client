import axios from 'axios'
import store from '../store';

const API_URL = 'http://localhost:3000/api/'

class AuthService {
	login(user){
		return axios
			.post(API_URL + 'login', {
				email: user.username,
				password: user.password
			})
			.then(response => {
				if(response.data.accessToken){
					localStorage.setItem('user', JSON.stringify(response.data))
				}
				return response.data
			})
	}
	logout(){
		const user = store.state.auth.user;
		axios
			.delete(API_URL + 'logout', {
				token: user.accessToken
			})	
		localStorage.removeItem('user')
	}
	register(user){
		return axios
			.post(API_URL + 'register', {
				name: user.username,
				email: user.email,
				password: user.password
			})
	}
}

export default new AuthService()