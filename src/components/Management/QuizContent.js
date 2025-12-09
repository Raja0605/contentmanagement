import { useEffect, useState } from "react";
import QuizService from "./QuizService";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { ClipLoader } from "react-spinners"; // Import the ClipLoader
import Swal from "sweetalert2"; // Import SweetAlert2
import BackButton from "../Backbutton/backbutton";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import Dashboard from "../Dashboard/Dashboard";
import "./QuizContent.css"

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
      
      // SweetAlert for success message
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
      
      // SweetAlert for error message
      Swal.fire({
        title: "Error",
        text: error.response ? error.response.data : "Something went wrong.",
        icon: "error",
        confirmButtonText: "Try Again"
      });
    } finally {
      setIsLoading(false); // Set loading to false when request is finished
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

const 
QuizContent = ({ categoryId }) => {
  const [quizContent, setQuizContent] = useState([]);
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
     
      setQuizContent(response.data);
    } catch (err) {
      console.error("Unable to fetch the records", err);
    }
  };

  const handleAddQuestion = (contentIndex) => {
    const newQuestion = {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctanswer: "",
    };
    const updatedQuizContent = [...quizContent];
    updatedQuizContent[contentIndex].jsonData.push(newQuestion);
    setQuizContent(updatedQuizContent);
  };

  const handleInputChange = (field, value, contentIndex, questionIndex) => {
    const updatedQuizContent = [...quizContent];
    updatedQuizContent[contentIndex].jsonData[questionIndex][field] = value;
    setQuizContent(updatedQuizContent);
  };

  const handleDeleteQuiz = (contentIndex, questionIndex) => {
    const updatedQuizContent = [...quizContent];
    updatedQuizContent[contentIndex].jsonData.splice(questionIndex, 1);
    setQuizContent(updatedQuizContent);
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
          categoryId: 1,
        },
      };
      await QuizService.updateContent(updatedContent);
      handleFetchAllContent();
    } catch (err) {
      console.error("Error while updating the quiz:", err);
    }
  };

  return (
    <div className="quiz-editor">
    <div className="back-button" onClick={() => navigate(-1)}>
      <IoArrowBackCircleSharp className="back-icon" />
    </div>

    {quizContent.map((item, contentIndex) => (
      <div key={contentIndex} className="quiz-container">
        <h4>Content ID: {item.contentId}</h4>

        {item.jsonData.map((data, questionIndex) => (
          <div key={questionIndex} className="question-box">
            <label>Question:</label>
            <input
              type="text"
              value={data.question || ""}
              onChange={(e) => handleInputChange("question", e.target.value, contentIndex, questionIndex)}
            />

            <label>Option 1:</label>
            <input
              type="text"
              value={data.option1 || ""}
              onChange={(e) => handleInputChange("option1", e.target.value, contentIndex, questionIndex)}
            />

            <label>Option 2:</label>
            <input
              type="text"
              value={data.option2 || ""}
              onChange={(e) => handleInputChange("option2", e.target.value, contentIndex, questionIndex)}
            />

            <label>Option 3:</label>
            <input
              type="text"
              value={data.option3 || ""}
              onChange={(e) => handleInputChange("option3", e.target.value, contentIndex, questionIndex)}
            />

            <label>Option 4:</label>
            <input
              type="text"
              value={data.option4 || ""}
              onChange={(e) => handleInputChange("option4", e.target.value, contentIndex, questionIndex)}
            />

            <label>Correct Answer:</label>
            <input
              type="text"
              value={data.correctanswer || ""}
              onChange={(e) => handleInputChange("correctanswer", e.target.value, contentIndex, questionIndex)}
            />

            <div className="button-container">
              <button className="delete-button" onClick={() => handleDeleteQuiz(contentIndex, questionIndex)}>
                Delete
              </button>
            </div>
          </div>
        ))}

        <div className="action-buttons">
          <button className="add-button" onClick={() => handleAddQuestion(contentIndex)}>Add Question</button>
          <button className="update-button" onClick={() => handleUpdateSubmit(item)}>Update Quiz</button>
          <button className="publish-button" onClick={() => handlePostImage(item.contentId)}>Publish Link</button>
        </div>
      </div>
    ))}

    {showPostImage && <Postimage closePopup={handleCancelPostImage} quizId={quizId} />}
  </div>
);
};

 

export default QuizContent;
