import axios from 'axios';

const API_CONTENT_CREATE_URL='http://localhost:2000/PostOnTwitter/createcontent';
const API_FETCH_CONTENTS_URL='http://localhost:2000/PostOnTwitter/fetchcontents';
const API_FETCH_CONTENTBYCATEGORYID_URL="http://localhost:2000/PostOnTwitter/contentcategory";

const API_UPDATE_URL='http://localhost:2000/PostOnTwitter/updatecontent';

const API_CREATE_USERHISTORY_URL='http://localhost:2000/PostOnTwitter/createuserhistory';
const API_FETCHUSERHISTORY_BYID_URL='http://localhost:2000/PostOnTwitter/fetchbyuserId';
const API_CREATE_USERVIDEO_URL='http://localhost:2000/PostOnTwitter/createuservideo';

const createContent = (payload) => {
    return axios.post(API_CONTENT_CREATE_URL, payload )
};

const fetchAllContent=()=>{
    return axios.get(API_FETCH_CONTENTS_URL)
};
const fetchAllContentbyCategory = async (categoryId) => {
    const response = await axios.get(
      `http://localhost:2000/PostOnTwitter/contentcategory/${categoryId}`
    );
    console.log("------->",response.data)
    return response.data;
  };

const updateContent = (updatedContent) => {
    const { contentId, ...data } = updatedContent;
    return axios.put(`${API_UPDATE_URL}/${contentId}`, data);
};  

const createUserHistory=(payload)=>{
    return axios.post(API_CREATE_USERHISTORY_URL,payload);
};

const createUserVideoHistory=(payload)=>{
    return axios.post(API_CREATE_USERVIDEO_URL,payload);
};

const fetchUserHistoryById=(userId)=>{
    return axios.get(`${API_FETCHUSERHISTORY_BYID_URL}/${userId}`);
};
  
const QuizService={
    createContent,fetchAllContent,updateContent,createUserHistory,fetchAllContentbyCategory,createUserVideoHistory,fetchUserHistoryById
}

export default QuizService;