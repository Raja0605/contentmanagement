import axios from 'axios';


const API_BASE_URL='http://localhost:2000/PostOnTwitter';
const API_LOGIN_URL='http://localhost:2000/PostOnTwitter/userlogin';
const API_CREATE_URL='http://localhost:2000/PostOnTwitter/createuser';
// const createRole = (formData) => {
//     return axios.post(API_CREATE_URL,formData);
// };
const userLogin = (login) =>{
    return axios.post(API_LOGIN_URL,login);
    
}

// const userRegister = (formData) =>{
//     return axios.post(API_CREATE_URL,formData);
// }

const LoginService={
    userLogin,
};

export default LoginService;