import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./UserFeedback.css";
import QuizService from "../Management/QuizService";
import { useLocation, useNavigate } from "react-router-dom";


const RatingCard = () => {
  const location = useLocation();
  const { jsonData, userId, contentId } = location.state || {};
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  
  const [feedresponse, setFeedresponse] = useState({
    feedback: "",
  });

  const navi = useNavigate();

  // Handle textarea change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedresponse({ ...feedresponse, [name]: value });
  };

  // Handle submit
  const FeedbackSubmit = async () => {
    
    if (rating === 0 || !feedresponse.feedback.trim()) {
      alert("Please provide a rating and feedback before submitting.");
      
      return;
    }

    const updatedResponses = jsonData.map(item => ({
      ...item,
      rating: rating,
      feedback: feedresponse.feedback,
    }));


    // Update responses state and ensure it is ready for submission


    // Ensure the updated state is used in the API call
    setTimeout(async () => {
      const payload = {
        jsonData: updatedResponses, // Ensure this is an array
        userId: userId,
        contentId: contentId,
      };
      navi('./userVideoPage');

      try {
        console.log("Submitting payload:", payload); // Debugging log

        const response = await QuizService.createUserHistory(payload);
        
        console.log("API Response:", response); // Log full response

        if (response?.data?.success) {
          alert("Thank you for your feedback!");
         
          navi("/dashboard");
        } else {
          alert("Submission failed. Please try again.");
          console.error("API did not return success:", response.data);
        }
      } catch (error) {
        console.error("Error saving data:", error.response?.data || error.message);
        alert("Something went wrong. Please check the console for details.");
      }
    }); // Delay to ensure state updates before submission
  };

  return (
    <div className="rating-card">
      <h2 className="rating-title">Rate this Quiz</h2>
      <div className="rating-stars">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <FaStar
              key={index}
              size={30}
              className={`star-icon ${
                starValue <= (hover || rating) ? "star-filled" : "star-empty"
              }`}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
      </div>
      <p className="rating-text">You rated: {rating} out of 5</p>

      <textarea
        className="feedback"
        id="feedback"
        name="feedback"
        value={feedresponse.feedback}
        onChange={handleChange}
        style={{
          border: "1px solid grey",
          height: "120px",
          width: "100%",
          resize: "none",
        }}
        placeholder="Enter your feedback about this Quiz"
        required
      />

      <button onClick={FeedbackSubmit} className="rating-submit-btn">
        Submit
      </button>
    </div>
  );
};

export default RatingCard;