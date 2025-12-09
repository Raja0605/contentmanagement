import { useEffect, useState } from "react";
import QuizService from "./QuizService";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { ClipLoader } from "react-spinners"; // Import the ClipLoader
import Swal from "sweetalert2"; // Import SweetAlert2
import BackButton from "../Backbutton/backbutton";
import { useNavigate } from "react-router-dom";
import "./PostContent.css";
import Dashboard from "../Dashboard/Dashboard";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const Postimage = ({ closePopup, quizId }) => {
  const [imageUrl, setImageUrl] = useState("");
  const caption = `http://localhost:3000?param=${quizId}`;
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to manage loader visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl || !caption) {
      // SweetAlert for missing image URL and caption
      Swal.fire({
        title: "Error",
        text: "Please provide both image URL and caption.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    setIsLoading(true); // Set loading to true when starting the request

    try {
      const response = await axios.post(
        `http://localhost:2000/PostOnTwitter/postimage?imageUrl=${encodeURIComponent(
          imageUrl
        )}&caption=${encodeURIComponent(caption)}`
      );
      localStorage.setItem('contentId', quizId);
      setResponseMessage(response.data);
      
     
      Swal.fire({
        title: "Success!",
        text: "Image posted successfully!",
        icon: "success",
        confirmButtonText: "OK"
      });

    } catch (error) {
      setResponseMessage(
        `Error: ${error.response ? error.response.data : error.message}`
      );
      
     
      Swal.fire({
        title: "Error",
        text: error.response ? error.response.data : "Something went wrong.",
        icon: "error",
        confirmButtonText: "Try Again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        backgroundColor: "#f9f9f9",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "20px",
        zIndex: 1000,
        width: "400px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
      }}
    >
      
      <h3>Instagram Post</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Image URL</label>
          <input
            type="text"
            onChange={(e) => setImageUrl(e.target.value)}
            value={imageUrl}
            placeholder="Enter the Image URL"
          />
        </div>
        <div>
          <label>Caption</label>
          <input type="text" value={caption} disabled />
        </div>
        <div style={{ display: "flex", marginTop: "10px" }}>
          <button type="submit" className="btn btn-primary me-2" disabled={isLoading}>
            {isLoading ? (
              <ClipLoader color="white" loading={isLoading} size={30} />
            ) : (
              "Post"
            )}
          </button>
          <button type="button" className="btn btn-secondary" onClick={closePopup}>
            Close
          </button>
        </div>
        {responseMessage && <p>{responseMessage}</p>}
      </form>
    </div>
  );
};

const PostContent = ({ categoryId }) => {
  const [memeContent, setMemeContent] = useState([]);
  const [showPostImage, setShowPostImage] = useState(false);
  const [quizId, setQuizId] = useState("");
  const navigate = useNavigate();
  

  useEffect(() => {
    handleFetchAllContent();
  }, []);

  const handleFetchAllContent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2000/PostOnTwitter/contentcategory/${categoryId}`

      );
      console.log("count of category-------->",response.data.length);
     
      setMemeContent(response.data);
    } catch (err) {
      console.error("Unable to fetch the records", err);
    }
  };

  const handleAddMeme = (contentIndex) => {
    const newMeme = {
     imageUrl:"",
     caption:""
    };
    const updatedMemeContent = [...memeContent];
    updatedMemeContent[contentIndex].jsonData.push(newMeme);
    setMemeContent(updatedMemeContent);
  };

  // const handleInputChange = (field, value, contentIndex, memeIndex) => {
  //   const updatedMemeContent = [...memeContent];
  //   updatedMemeContent[contentIndex].jsonData[memeIndex][field] = value;
  //   setMemeContent(updatedMemeContent);
  // };

  const handleDeleteQuiz = (contentIndex, memeIndex) => {
    const updatedMemeContent = [...memeContent];
    updatedMemeContent[contentIndex].jsonData.splice(memeIndex, 1);
    setMemeContent(updatedMemeContent);
  };

  const handlePostImage = (quizId) => {
    setShowPostImage(true);
    setQuizId(quizId);
  };

  const handleCancelPostImage = () => {
    setShowPostImage(false);
    setQuizId("");
  };

  const handleUpdateSubmit = async (data) => {
    try {
      const updatedContent = {
        contentId: data?.contentId,
        jsonData: data?.jsonData,
        status: 1,
        category: {
          categoryId: 102,
        },
      };
      await QuizService.updateContent(updatedContent);
      handleFetchAllContent();
    } catch (err) {
      console.error("Error while updating the quiz:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="back-button" onClick={() => navigate(-1)}>
        <IoArrowBackCircleSharp className="back-icon" />
      </div>
      {memeContent.map((item, contentIndex) => (
        <div key={contentIndex} className="meme-container">
          <h4>Content ID: {item.contentId}</h4>
          {item.jsonData.map((data, memeIndex) => (
            <div key={memeIndex} className="meme-input-container">
              <label>Image URL:</label>
              <input type="text" value={data.imageurl || ""} className="input-field" />
              <label>Caption:</label>
              <input type="text" value={data.caption || ""} className="input-field" />
              <div className="button-group">
                <button className="btn-delete" onClick={() => handleDeleteQuiz(contentIndex, memeIndex)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          <div className="button-container">
            <button className="btn-primary" onClick={() => handleAddMeme(contentIndex)}>
              Add Question
            </button>
            <button className="btn-success" onClick={() => handleUpdateSubmit(item)}>
              Update Quiz
            </button>
            <button className="btn-info" onClick={() => handlePostImage(item.contentId)}>
              Publish Link..
            </button>
          </div>
        </div>
      ))}
      {showPostImage && <Postimage closePopup={handleCancelPostImage} quizId={quizId} />}
    </div>
  );
};

export default PostContent;
