import axios from "axios";

const API_BASE_URL = "http://localhost:2000/PostOnTwitter";
const API_CREATE_URL = `${API_BASE_URL}/createcategory`;
const API_FETCH_URL = `${API_BASE_URL}/fetchcategory`;
const API_DELETE_URL = `${API_BASE_URL}/deletecategory`;
const API_UPDATE_URL = `${API_BASE_URL}/updatecategory`;

const createCategory = (category) => {
  return axios.post(API_CREATE_URL, category);
};

const getAllCategories = () => {
  return axios.get(API_FETCH_URL);
};
const fetchcategorybyId=(id)=>{
  return axios.get(`${API_FETCH_URL}/${id}`)
}

const updateCategory = (id, updatedCategory) => {
  return axios.put(`${API_UPDATE_URL}/${id}`, updatedCategory);
};

const deleteCategory = (id) => {
  return axios.delete(`${API_DELETE_URL}/${id}`);
};

export default {
  createCategory,
  deleteCategory,
  getAllCategories,
  fetchcategorybyId,
  updateCategory,
};