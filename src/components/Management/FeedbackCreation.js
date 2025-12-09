import React, { useState,useEffect } from 'react'
import './FeedbackCreation.css'
import axios from 'axios';

const FeedbackCreation=()=>{
const [questions, setQuestions] = useState([]);
    const [currentQuestion,setCurrentQuestion]=useState({
        question:""
})
const [isEditing, setIsEditing] = useState(false);
const [editIndex, setEditIndex] = useState(null);
const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`${name}: ${value}`); // Log each field update
    setCurrentQuestion({ ...currentQuestion, [name]: value });
  };
  const handleAddQuestion = () => {
    const { question } = currentQuestion;
  

    console.log("Current Question:", question); // Check contentName value

    if ( !question ) {
      alert("Please fill in  field before adding the question.");
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
      
    });
  };
  const handleEditQuestion = (index) => {
    setCurrentQuestion(questions[index]);
    setIsEditing(true);
    setEditIndex(index);
    console.log(index);
    
    
  };
  const handleSubmitQuiz = async () => {
    if (questions.length === 0) {
      alert("Please add at least one question before submitting.");
      return;
    }

    const payload = {
    //   contentName: contentName,  // Send contentName separately
      jsonData: questions,  // Send questions as the content for jsonData
      status: 1,  // Adjust status as needed
      category: {
        categoryId: 102,  // Adjust categoryId as needed
      },
    };

    try {
      const response = await axios.post("http://localhost:2000/PostOnTwitter/createcontent", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Payload:", payload);
      alert("Feedback submitted successfully!");
      console.log(response.data);
      setQuestions([]);
    //   setContentName("");  // Reset contentName state
      setCurrentQuestion({
        question: ""
       
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Unable to submit feedback. Please try again.");
    }
  };
//   useEffect(() => {
//     handleFetchAllContent();
//   }, []);
//   const handleFetchAllContent = async () => {
//     try {
//       const fetchresponse = await QuizService.fetchAllContent();
//       console.log("fetchresponse", fetchresponse);
//       // setQuizContent(fetchresponse.data);
//       console.log("Records fetched successfully");
//     } catch (err) {
//       console.log("Unable to fetch the records");
//     }
//   };

  return (
    <div className='pageee'>
        <div className='par'>
            <div className='sub'>
                <p>Feedback Creation</p>
                <div className='form'>
                    {/* <form> */}
                <label htmlFor='question' style={{fontsize:"25px"}}>Question :</label><br/>
                <input
                     type="text"
                     className='questioninput'
                     name="question"
                     value={questions.currentQuestion}
                     onChange={handleInputChange}
                     placeholder="Enter Your Question"
                    //  style={{ width: "100%", margin: "5px 0", padding: "8px" }}
                />
                {/* </form> */}
                <br/>
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
            marginLeft:"200px"
          }}
        >
          {isEditing ? "Update Question" : "Add Question"}
        </button>
                </div>
               
            </div>
            <div style={{ marginBottom: "20px" }}>
        <h2>Questions List</h2>
        {questions.length > 0 ? (
          <ul>
            {questions.map((q, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <strong>Q{index + 1}: </strong> {q.question}
               <br/>
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
          <p style={{textAlign:"start"}}>No questions added yet.</p>
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
  )
}

export default FeedbackCreation
