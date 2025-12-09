import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import QuizService from './QuizService';
import Swal from 'sweetalert2';
import { ClipLoader } from 'react-spinners';

const FeedbackContent=()=> {

    const [feedbackContent, setFeedbackContent] = useState([]);
    const [showPostImage, setShowPostImage] = useState(false);
    const [feedbackId, setFeedbackId] = useState("");
    const navigate = useNavigate();
    const categoryId=4;
    useEffect(() => {
        handleFetchAllContent();
      }, []);
    
      const handleFetchAllContent = async () => {
        try {
          const response = await axios.get(
            `http://localhost:2000/PostOnTwitter/contentcategory/${categoryId}`
          );
          setFeedbackContent(response.data);
        } catch (err) {
          console.error("Unable to fetch the records", err);
        }
      };

      

    const handleAddQuestion = (contentIndex) => {
        const newQuestion = {
          question: "",
          
        };
        const updatedFeedbackContent = [...feedbackContent];
        updatedFeedbackContent[contentIndex].jsonData.push(newQuestion);
        setFeedbackContent(updatedFeedbackContent);
      };

    const handleInputChange = (field, value, contentIndex, questionIndex) => {
        const updatedFeedbackContent = [...feedbackContent];
        updatedFeedbackContent[contentIndex].jsonData[questionIndex][field] = value;
        setFeedbackContent(updatedFeedbackContent);
    };

    const handlePostImage = (feedbackId) => {
        setShowPostImage(true);
        setFeedbackId(feedbackId);
      };


  const handleCancelPostImage = () => {
    setShowPostImage(false);
    setFeedbackId("");
  };

      const handleDeleteQuiz = (contentIndex, questionIndex) => {
        const updatedFeedbackContent = [...feedbackContent];
        updatedFeedbackContent[contentIndex].jsonData.splice(questionIndex, 1);
        setFeedbackContent(updatedFeedbackContent);
    };

    const handleUpdateSubmit = async (data) => {
        try {
          const updatedContent = {
            contentId: data?.contentId,
            jsonData: data?.jsonData,
            status: 1,
            category: {
              categoryId: 52,
            },
          };
          await QuizService.updateContent(updatedContent);
          handleFetchAllContent();
        } catch (err) {
          console.error("Error while updating the quiz:", err);
        }
      };
    

  return (
    <div>
        {feedbackContent.map((item, contentIndex) => (
        <div key={contentIndex} style={{ border: "1px solid #ccc", marginBottom: "20px", width:"50%", position:"relative", left:"25%"}}>
          <h4>Content ID: {item.contentId}</h4>
          {item.jsonData.map((data, questionIndex) => (
            <div key={questionIndex} style={{ marginBottom: "10px", padding: "10px" }}>
              <label>Question:</label>
              <input
                type="text"
                value={data.question || ""}
                onChange={(e) =>
                  handleInputChange("question", e.target.value, contentIndex, questionIndex)
                }
              />
              <div className="d-flex justify-content-end mt-2">
                <button
                  className="btn btn-danger btn-sm"
                  style={{width:"152px", marginRight:"75%"}}
                  onClick={() => handleDeleteQuiz(contentIndex, questionIndex)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-between mt-3" style={{marginBottom:"10px"}}>
            <button
              className="btn btn-primary"
              style={{width:"200px"}}
              onClick={() => handleAddQuestion(contentIndex)}
            >
              Add Question
            </button>
            <button
              className="btn btn-success"
              style={{width:"200px"}}
              onClick={() => handleUpdateSubmit(item)}
            >
              Update Quiz
            </button>
            <button
              className="btn btn-info"
              style={{width:"200px"}}
              onClick={() => handlePostImage(item.contentId)}
            >
              Publish Link..
            </button>
          </div>
        
        </div>
      ))}

      {showPostImage && <Postimage closePopup={handleCancelPostImage} feedbackId={feedbackId} />}
      
    </div>
  )
}
const Postimage = ({ closePopup, feedbackId }) => {
    const [imageUrl, setImageUrl] = useState("");
    const caption = `http://localhost:3000?param=${feedbackId}`;
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
        localStorage.setItem('contentId', feedbackId);
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
  

export default FeedbackContent;
