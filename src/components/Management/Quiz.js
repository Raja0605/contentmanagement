import React, { useEffect, useState } from "react";
import axios from "axios";
import QuizService from "./QuizService";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const [contentName, setContentName] = useState("");  // Separate contentName state
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctanswer: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`${name}: ${value}`); // Log each field update
    setCurrentQuestion({ ...currentQuestion, [name]: value });
  };

  const handleAddQuestion = () => {
    const { question, option1, option2, option3, option4, correctanswer } = currentQuestion;

    console.log("Current contentName:", contentName); // Check contentName value

    if (!contentName || !question || !option1 || !option2 || !option3 || !option4 || !correctanswer) {
      alert("Please fill in all fields before adding the question.");
      return;
    }

    if (isEditing) {
      const updatedQuestions = [...questions];
      updatedQuestions[editIndex] = currentQuestion;
      setQuestions(updatedQuestions);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setQuestions([...questions, currentQuestion]);
    }

    setCurrentQuestion({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctanswer: "",
    });
  };

  const handleEditQuestion = (index) => {
    setCurrentQuestion(questions[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleSubmitQuiz = async () => {
    if (questions.length === 0) {
      alert("Please add at least one question before submitting.");
      return;
    }

    const payload = {
      contentName: contentName,  // Send contentName separately
      jsonData: questions,  // Send questions as the content for jsonData
      status: 1,  // Adjust status as needed
      category: {
        categoryId: 1,  // Adjust categoryId as needed
      },
    };

    try {
      const response = await axios.post("http://localhost:2000/PostOnTwitter/createcontent", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Payload:", payload);
      alert("Quiz submitted successfully!");
      console.log(response.data);
      setQuestions([]);
      setContentName("");  // Reset contentName state
      setCurrentQuestion({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctanswer: "",
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Unable to submit quiz. Please try again.");
    }
  };

  useEffect(() => {
    handleFetchAllContent();
  }, []);

  const handleFetchAllContent = async () => {
    try {
      const fetchresponse = await QuizService.fetchAllContent();
      console.log("fetchresponse", fetchresponse);
      // setQuizContent(fetchresponse.data);
      console.log("Records fetched successfully");
    } catch (err) {
      console.log("Unable to fetch the records");
    }
  };

  return (
    <div> 
      <div style={{border:"none",backgroundColor:"transparent"} } onClick={()=>navigate(-1)}>
    <IoArrowBackCircleSharp style={{fontSize:"40px",borderRadius:"50%" ,backgroundColor:"#F8F8F8"}}/>
 
    </div>
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
     
      <h1 style={{ textAlign: "center" }}>Quiz Creation</h1>

      <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <div>
          <label>Content Name:</label>
          <input
            type="text"
            name="contentName"
            value={contentName}  // Bind it to the separate contentName state
            onChange={(e) => setContentName(e.target.value)}  // Update contentName state on change
            placeholder="Enter the content name"
            style={{ width: "100%", margin: "5px 0", padding: "8px" }}
          />
          <label>Question:</label>
          <input
            type="text"
            name="question"
            value={currentQuestion.question}
            onChange={handleInputChange}
            placeholder="Enter the question"
            style={{ width: "100%", margin: "5px 0", padding: "8px" }}
          />
        </div>
        <div>
          <label>Option 1:</label>
          <input
            type="text"
            name="option1"
            value={currentQuestion.option1}
            onChange={handleInputChange}
            placeholder="Enter option 1"
            style={{ width: "100%", margin: "5px 0", padding: "8px" }}
          />
        </div>
        <div>
          <label>Option 2:</label>
          <input
            type="text"
            name="option2"
            value={currentQuestion.option2}
            onChange={handleInputChange}
            placeholder="Enter option 2"
            style={{ width: "100%", margin: "5px 0", padding: "8px" }}
          />
        </div>
        <div>
          <label>Option 3:</label>
          <input
            type="text"
            name="option3"
            value={currentQuestion.option3}
            onChange={handleInputChange}
            placeholder="Enter option 3"
            style={{ width: "100%", margin: "5px 0", padding: "8px" }}
          />
        </div>
        <div>
          <label>Option 4:</label>
          <input
            type="text"
            name="option4"
            value={currentQuestion.option4}
            onChange={handleInputChange}
            placeholder="Enter option 4"
            style={{ width: "100%", margin: "5px 0", padding: "8px" }}
          />
        </div>
        <div>
          <label>Correct Answer:</label>
          <input
            type="text"
            name="correctanswer"
            value={currentQuestion.correctanswer}
            onChange={handleInputChange}
            placeholder="Enter the correct answer"
            style={{ width: "100%", margin: "5px 0", padding: "8px" }}
          />
        </div>
        <button
          onClick={handleAddQuestion}
          style={{
            backgroundColor: isEditing ? "#ffc107" : "#007bff",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          {isEditing ? "Update Question" : "Add Question"}
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Questions List</h2>
        {questions.length > 0 ? (
          <ul>
            {questions.map((q, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <strong>Q{index + 1}: </strong> {q.question}
                <ul>
                  <li>Option 1: {q.option1}</li>
                  <li>Option 2: {q.option2}</li>
                  <li>Option 3: {q.option3}</li>
                  <li>Option 4: {q.option4}</li>
                  <li>Correct Answer: {q.correctanswer}</li>
                </ul>
                <button
                  onClick={() => handleEditQuestion(index)}
                  style={{
                    backgroundColor: "#ffc107",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No questions added yet.</p>
        )}
      </div>

      <button
        onClick={handleSubmitQuiz}
        style={{
          backgroundColor: "#28a745",
          color: "white",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          display: "block",
          width: "200px",
          alignItems: "center",
        }}
      >
        Submit Quiz
      </button>
    </div>
    </div>
  );
};

export default Quiz;
