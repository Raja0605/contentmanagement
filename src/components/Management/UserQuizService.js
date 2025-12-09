import axios from "axios";

const API_FETCH_CONTENTBY_ID_URL='http://localhost:2000/PostOnTwitter/user';
const API_FETCH_ALLUSERHISTORY_URL='http://localhost:2000/PostOnTwitter/fetchalluserhistory';


const fetchContentById=(categoryName)=>{
    
    return axios.get(`${API_FETCH_CONTENTBY_ID_URL}/${localStorage.getItem('userId')}/newcontent?categoryName=${categoryName}`);
};

const fetchAllUserHistory=()=>{
    return axios.get(API_FETCH_ALLUSERHISTORY_URL);
};

const UserQuizService={
    fetchContentById,fetchAllUserHistory
}

export default UserQuizService;