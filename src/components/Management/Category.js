import React, { useEffect, useState } from "react";
import CategoryService from "./CategoryService";
import "./Category.css";
import { Navigate, useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";

const Category = () => {
  const [createCategory, setCreateCategory] = useState(false);

  const [category, setCategory] = useState({
    categoryName: "",
    categoryDescription: "",
    points: 0,
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [updatingCategoryId, setUpdatingCategoryId] = useState(null);
  const [categorysearchbar, setCategorysearchbar] = useState('');
  const navigate=useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getAllCategories();
      setCategories(response.data.categoryDTO || []);
      setError(null); // Clear error on success
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to retrieve category details");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      await handleUpdateSubmit();
    } else {
      try {
        const response = await CategoryService.createCategory(category);
        setSuccess("Category saved successfully");
        alert(response.data);
        setCategory({
          categoryName: "",
          categoryDescription: "",
          points: 0,
        });
        fetchCategories();
        setCreateCategory(false); // Hide form after successful submission
      } catch (err) {
        console.error("Error creating category:", err);
        setError("Failed to save category. Please try again.");
      }
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      await CategoryService.updateCategory(updatingCategoryId, category);
      setSuccess("Category updated successfully");
      setEditIndex(null);
      setCategory({
        categoryName: "",
        categoryDescription: "",
        points: "",
      });
      fetchCategories();
      setCreateCategory(false); // Hide form after successful update
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Failed to update category. Please try again.");
    }
  };

  const handleEditClick = (category) => {
    setCategory({
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription,
      points: category.points,
    });
    setUpdatingCategoryId(category.categoryId);
    setEditIndex(true);
    setCreateCategory(true); // Show form for editing
  };

  const handleDelete = async (id) => {
    try {
      await CategoryService.deleteCategory(id);
      setSuccess("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category. Please try again.");
    }
  };

  const filteredCategories = categories.filter((category) =>
    ["categoryId", "categoryName", "categoryDescription", "points"].some((key) =>
      category[key]?.toString().toLowerCase().includes(categorysearchbar.toLowerCase())
    )
  );

  return (
    <div className="cat-page">
      <div style={{border:"none",backgroundColor:"transparent"} } onClick={()=>navigate(-1)}>
      <IoArrowBackCircleSharp style={{fontSize:"40px",borderRadius:"50%" ,backgroundColor:"#F8F8F8"}}/>
   
      </div>
    <div>
      
    
      {/* <main className="main"> */}
        {createCategory ? (
          <div className="add-table">
            <h1 className="cathead">Category Form</h1>
            <form onSubmit={handleFormSubmit} className="input-table">
              <table>
                <tbody>
                  <tr>
                    <th className="table-content">
                      <label htmlFor="categoryName" >Category Name:</label>
                    </th>
                    <td>
                      <select
                        className="input-table"
                        placeholder="Enter the category name"
                        value={category.categoryName}
                        onChange={handleInputChange}
                        id="categoryName"
                        name="categoryName"
                        required
                      >
                        <option value="Quiz">Quiz</option>
                        <option value="Memes">Memes</option>
                        <option value="Video">Video</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Referral">Referral</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <label htmlFor="categoryDescription">Description:</label>
                    </th>
                    <td>
                      <input
                        type="text"
                        className="description"
                        placeholder="Enter the description"
                        value={category.categoryDescription}
                        onChange={handleInputChange}
                        id="categoryDescription"
                        name="categoryDescription"
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <label htmlFor="points">Points:</label>
                    </th>
                    <td>
                      <input
                        type="number"
                        className="input-table"
                        placeholder="Enter points"
                        value={category.points}
                        onChange={handleInputChange}
                        id="points"
                        name="points"
                        required
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="btn-container" style={{display:"flex"}}>
              <button
                type="button"
                className="cal-btn"
                onClick={() => setCreateCategory(false)}
              >
                Cancel
              </button>
              <button type="submit" className="sub-btn">
                {editIndex !== null ? "Update" : "Submit"}
              </button>
              </div>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
          </div>
        ) : (
          <div style={{width: "100%"}}>
            <div className="add-btn">
              <input className="catsearchbar"
                type="text"
                placeholder="Search..."
                onChange={(e) => setCategorysearchbar(e.target.value)}
                value={categorysearchbar}
              />
              <button className="btna" onClick={() => setCreateCategory(true)}>
                + Add Category
              </button>
            </div>
            <div className="table-container">
              <div className="output-table">
                <table className="output-tables">
                  <thead>
                    <tr>
                      <th>Category ID</th>
                      <th>Category Name</th>
                      <th>Category Description</th>
                      <th>Points</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category, index) => (
                      <tr key={index}>
                        <td>{category.categoryId}</td>
                        <td>{category.categoryName}</td>
                        <td>{category.categoryDescription}</td>
                        <td>{category.points}</td>
                        <td>
                          <button
                            className="cl-edit"
                            onClick={() => handleEditClick(category)}
                          >
                            <CiEdit />
                          </button>
                          <button
                            className="ct-del"
                            onClick={() => handleDelete(category.categoryId)}
                          >
                            <RiDeleteBin6Line />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      {/* </main> */}
    </div>
    </div>
  );
};

export default Category;
