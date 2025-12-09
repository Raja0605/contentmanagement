import axios from 'axios';
const API_FETCHALLUSERS_URL='http://localhost:2000/PostOnTwitter/fetchallusers';
const API_ADDUSER_URL='http://localhost:2000/PostOnTwitter/createuser';

const fetchAllUsers=()=>{
    return axios.get(API_FETCHALLUSERS_URL);
}

const createUser=(formData)=>{
    return axios.post(API_ADDUSER_URL,formData);
}

const UserService={
    fetchAllUsers,createUser
}

export default UserService;