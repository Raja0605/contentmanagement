import React, { useState, useEffect } from "react";
import QuizService from "../Management/QuizService";
import UserQuizService from "../Management/UserQuizService";
import "./UserQuiz.css";
import { useNavigate } from "react-router-dom";
import UserVideoPage from "./UserVideoPage";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import UserMemes from "./UserMemePage";

const UserQuiz = ({ onLogout }) => {
    const [userQuiz, setUserQuiz] = useState([]);
    const [quizpage, setQuizpage] = useState(false);
    const [userDashBoard, setUserDashBoard] = useState(true);
    const [userHistorypage, setUserHistorypage] = useState(false);
    const [quizId, setQuizId] = useState(""); // State to store user-entered Quiz ID
    const navigate = useNavigate();
    const contentId = localStorage.getItem('contentId');
    const userId = localStorage.getItem('userId');
    const [error, setError] = useState("");
    const [uservideopage, setUservideopage] = useState(false)
    const [usermemepage, setUsermemepage] = useState(false)

    const [userFeedbackPage, setUserFeedbackPage] = useState(false)
    const [userHistory, setUserHistory] = useState([]);
    const [categoryId, setCategoryId] = useState();


    const [totalQuiz, setTotalQuiz] = useState(0);
    const [totalVideos, setTotalVideos] = useState(0);
    const [totalMemes, setTotalMemes] = useState(0);
    const [totalFeedback, setTotalFeedback] = useState(0);
    const [totalScores, setTotalScores] = useState("0/0");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);

    useEffect(() => {
        if (contentId) {
            setQuizId(contentId);
        }
    }, [contentId]);

    const handlefetchContentById = async (contentId) => {
        try {
            const fetchResponse = await UserQuizService.fetchContentById(contentId);
            console.log('contentId ------------------>', fetchResponse?.data);
            setUserQuiz(fetchResponse?.data?.jsonData || []);
            setQuizId(fetchResponse?.data?.contentId);
            console.log("User response", fetchResponse);
            setCategoryId(fetchResponse?.data?.category?.categoryId)

        } catch (err) {
            console.log("Content is not defined");
        }
    };

    // Fetch quiz when user submits a quiz ID
    const handleFetchQuizById = () => {
        if (quizId) {
            handlefetchContentById(quizId);
        } else {
            alert("Please enter a valid Quiz ID.");
        }
    };

    useEffect(() => {
        // Automatically fetch quiz if quizId is set
        if (quizId) {
            handlefetchContentById('quiz');
        }
    }, [quizId]);

    const [responses, setResponses] = useState([]);

    const handleOptionChange = (questionIndex, question, selectedOption) => {
        setResponses((prevResponses) => {
            const updatedResponses = [...prevResponses];
            const existingIndex = updatedResponses.findIndex(
                (response) => response.questionIndex === questionIndex
            );

            if (existingIndex >= 0) {
                updatedResponses[existingIndex] = {
                    questionIndex,
                    question,
                    selectedAnswer: selectedOption,
                };
            } else {
                updatedResponses.push({
                    questionIndex,
                    question,
                    selectedAnswer: selectedOption,
                });
            }

            return updatedResponses;
        });
    };

    const handleQuizSubmit = async () => {
        const userId = localStorage.getItem("userId");
        if (!quizId) {
            alert("Please enter a Quiz ID before submitting.");
            return;
        }
        const payload = {
            jsonData: responses,
            userId: userId,
            contentId: quizId, // Use the user-entered quizId
        };

        navigate('/feedbackRating', { state: payload });
        // try {
        //     const response = await QuizService.createUserHistory(payload);
        //     if (response.data.success === true) {
        //         alert(response.data.message);
        //         alert("Your score is " + response?.data?.userHistory?.scores);
        //         console.log("Data saved successfully:", response.data);


        //         // Redirect to the quiz page after submission
        //         navigate("/feedbackRating");

        //     } else {
        //         alert(response.data.message);
        //         navigate("/logout");
        //     }
        // } catch (error) {
        //     console.error("Error saving data:", error);
        // }
    };

    const handleFetchUserHistoryById = async (userId) => {
        try {
            const fetchuserhistoryResponse = await QuizService.fetchUserHistoryById(userId);
            const userHistoryData = fetchuserhistoryResponse?.data || [];

            // Set user first and last name from local storage
            setLastname(localStorage.getItem("ad-or-lastname") || "");
            setFirstname(localStorage.getItem("ad-or-firstname") || "");

            console.log("Fetched User History Data:", userHistoryData);

            if (userHistoryData.length === 0) {
                console.warn("No user history found!");
                return;
            }

            const quizCount = userHistoryData.reduce((count, historycountbyid) => count + (historycountbyid.jsonData?.length || 0), 0)
            const totalScore = userHistoryData.reduce((sum, history) => sum + (history.scores || 0), 0);
            const totalMark = quizCount;



            const averagePercentage = totalMark > 0 ? (totalScore / quizCount) * 10 : 0;


            const filteredQuizzes = userHistoryData.filter(history => String(history.categoryId) == "1");

            console.log("Filtered Quizzes:", filteredQuizzes);
            console.log("Total Filtered Quizzes:", filteredQuizzes.length);

            if (filteredQuizzes.length === 0) {
                console.warn("No quizzes found for categoryId 1!");
            }

            // Map quiz scores for bar chart display
            const quizScores = filteredQuizzes.map((history, index) => ({
                name: `Quiz ${index + 1}`,
                score: history.scores || 0,
            }));

            console.log("Mapped Quiz Scores:", quizScores);

            // Update state with fetched values
            setTotalScores(`${totalScore}`);
            setBarChartData(quizScores);
            setUserHistory(userHistoryData);
            setTotalQuiz(userHistoryData[0]?.quizcount || 0);
            setTotalVideos(userHistoryData[0]?.videocount || 0);
            setTotalMemes(userHistoryData[0]?.memecount || 0);
            setTotalFeedback(userHistoryData[0]?.feedbackcount || 0);

            // Pie Chart: Show only average score as a percentage
            setPieChartData([
                { name: "Achieved", value: averagePercentage, color: "#1C737D" }, // Blue for achieved percentage
                { name: "Remaining", value: 100 - averagePercentage, color: "#A8DADC" }, // Light blue for remaining
            ]);

        } catch (err) {
            console.error("Error fetching user history:", err);
        }
    };








    console.log("user history:", userHistory);
    useEffect(() => {
        if (userId) {
            handleFetchUserHistoryById(userId);
        }
    }, [userId]);

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

    const UserDashboard = () => {
        setUserDashBoard(true);
        setUserHistorypage(false);
        setQuizpage(false);
        setUservideopage(false);
        setUserFeedbackPage(false);
        setUsermemepage(false);
    };
    const UserHistoryPage = () => {
        setUserHistorypage(true);
        setQuizpage(false);
        setUserDashBoard(false);
        setUservideopage(false);
        setUserFeedbackPage(false);
        setUsermemepage(false);
    };

    const UserQuizPage = () => {
        setQuizpage(true);
        setUserDashBoard(false);
        setUserHistorypage(false);
        setUservideopage(false);
        setUserFeedbackPage(false);
        setUsermemepage(false);
    };
    const UserVideoPape = () => {
        setUserDashBoard(false);
        setQuizpage(false);
        setUserHistorypage(false);
        setUservideopage(true);
        setUserFeedbackPage(false);
        setUsermemepage(false);
    };
    const userFeedback = () => {
        setUserFeedbackPage(true);
        setUserDashBoard(false);
        setQuizpage(false);
        setUserHistorypage(false);
        setUservideopage(false);
        setUsermemepage(false);
    }
    const UserMemePage = () => {
        setUsermemepage(true);
        setUserFeedbackPage(false);
        setUserDashBoard(false);
        setQuizpage(false);
        setUserHistorypage(false);
        setUservideopage(false);

    }

    const handleLogin = async () => {
        const storedContentId = localStorage.getItem("contentId");

        if (!storedContentId || isNaN(storedContentId)) {
            setError("Invalid Quiz ID");
            return;
        }

        try {
            const response = await fetch("http://localhost:2000/PostOnTwitter/verify-content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contentId: parseInt(storedContentId) }), // Convert to Integer
            });

            const data = await response.json();
            if (data.success) {
                navigate(`/quiz/${storedContentId}`); // Redirect to quiz page
            } else {
                setError(data.message || "Quiz not available.");
            }
        } catch (error) {
            console.error("Error verifying quiz:", error);
            setError("Server error, please try again.");
        }
    };

    return (
        <div className="head">
            <nav className="Nav-bar">
                <ul style={{ float: "right" }}>
                    <li onClick={UserDashboard}>DASHBOARD</li>
                    <li onClick={UserQuizPage}>QUIZ</li>
                    <li onClick={UserVideoPape}>VIDEO</li>
                    <li onClick={UserMemePage}>MEME</li>
                    <li onClick={UserHistoryPage}>HISTORY</li>
                    <li onClick={handleLogout}>LOGOUT</li>
                </ul>
            </nav>

            {/* Dashboard */}
            <div className="user-dashboard" style={{ display: userDashBoard ? "block" : "none" }}>
                <div className="dashname">
                    <div className="wh">

                        <h4 className="h4">
                            Welcome Back {firstname} {lastname} !!
                        </h4>
                        <div className="quiz-boxs">
                            <h2>🚀 Welcome to the Ultimate Quiz! 🎉</h2>
                            <p>Test your knowledge, challenge friends, and climb the leaderboard! 🏆</p>
                            <p>Answer fast, score high, and become the quiz champion! 🔥</p>
                            <p>Exciting questions, fun challenges, and big rewards await! 🎯</p>
                            <a onClick={UserQuizPage} class="start-btn">Start Quiz</a>

                        </div>
                        {/* Dashboard Stats */}
                        <div className="dashboard">
                            <div className="dashboard-card">
                                <p>Total Quizzes</p>
                                <p className="card-value">{totalQuiz}</p>
                            </div>
                            <div className="dashboard-card">
                                <p>Total Videos</p>
                                <p className="card-value">{totalVideos}</p>
                            </div>
                            <div className="dashboard-card">
                                <p>Total Memes</p>
                                <p className="card-value">{totalMemes}</p>
                            </div>
                            {/* <div className="dashboard-card">
                                <p>Total Feedback</p>
                                <p className="card-value">{totalFeedback}</p>
                            </div> */}
                            <div className="dashboard-card">
                                <p>Total Score</p>
                                <p className="card-value">{totalScores}</p>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="chart-container-wrapper">
                            {/* Pie Chart */}

                            <div className="chart-container">
                                <h3>Average Score</h3>
                                <ResponsiveContainer width="90%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            dataKey="value"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={90}
                                            innerRadius={50}
                                            label={({ percent, index }) =>
                                                index === 0
                                                    ? `🔵 ${Math.round(percent * 100)}%`  // Blue Scored Percentage
                                                    : `⚪ ${Math.round(percent * 100)}%`  // Gray Remaining Percentage
                                            }
                                        >
                                            <Cell fill="#6366F1" /> {/* Blue for Scored */}
                                            <Cell fill="#D1D5DB" /> {/* Gray for Remaining */}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>




                            {/* Bar Chart for Quiz Scores */}
                            <div className="chart-container">
                                <h3>Scores Per Quiz</h3>
                                <ResponsiveContainer width="90%" height={250}>
                                    <BarChart data={barChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="score" fill="#82ca9d" /> {/* Green for Quiz Scores */}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                </div>
                {/* <div className="quiz-info" style={{ backgroundImage: "url('/image/userbackground.webp')" }}>
                    <div className="Dashboard">
                        <h2>Hello Everyone</h2>
                        <div>
                            <h4>Welcome to the Ultimate Quiz Competition!</h4>
                            <h4>Challenge your knowledge and win exciting prizes.</h4>
                        </div>
                    </div>
                </div> */}
            </div>

            <div className="userVideo" style={{ display: uservideopage ? "block" : "none" }}>
                <UserVideoPage />
            </div>


            <div className="userVideo" style={{ display: usermemepage ? "block" : "none" }}>
                <UserMemes />
            </div>


            {/* UserHistory */}
            <div className="user-history" style={{ display: userHistorypage ? "block" : "none" }}>
                <div >
                    <table className="user-history-table">
                        <thead>
                            <tr>
                                <th>User History ID</th>
                                <th>User Name</th>
                                <th>Content ID</th>
                                <th>Content Name</th>
                                <th>Scores</th>
                                <th>Reward Points</th>
                                <th>Attempted Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userHistory.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.userHistoryId}</td>
                                    <td>{item.userName}</td>
                                    <td>{item.contentId}</td>
                                    <td>{item.contentName}</td>
                                    <td>{item.scores}</td>
                                    <td>{item.rewardsPoint}</td>
                                    <td>
                                        {item?.attemptedDate && item.attemptedDate !== null
                                            ? new Date(item.attemptedDate).toLocaleDateString()
                                            : "Date not found"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>

            {/* Quiz Section */}
            <div className="quiz-box" style={{ display: quizpage ? "block" : "none" }}>
                {quizId !== 0 && categoryId === 1 ? (
                    userQuiz?.map((data, index) => (
                        <div key={index}>
                            <div style={{ border: "1px solid #ccc", marginBottom: "10px", backgroundColor: "#e5eaf5", padding: "10px", width: "50%", marginLeft: "25%" }}>
                                <div
                                    key={index}
                                    style={{
                                        marginBottom: "20px",
                                        padding: "10px",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <div style={{ display: "flex", flexDirection: "row", gap: "15px" }}>
                                        <p>{index + 1 + "."}</p>
                                        <p>{data?.question}</p>
                                    </div>
                                    <table className="table table-bordered table-hover">
                                        {[data?.option1, data?.option2, data?.option3, data?.option4].map((option, optIndex) => (
                                            <tr key={optIndex}>
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="col-2">
                                                            <input
                                                                type="radio"
                                                                id={`option-${optIndex}-${index}`}
                                                                name={`question-${index}`}
                                                                value={option}
                                                                onChange={() =>
                                                                    handleOptionChange(index, data?.question, option)
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col-10 text-start">
                                                            <label>{option}</label>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                                <button className="user-btn" style={{ position: "fixed", bottom: "10%", right: "10%" }} onClick={handleQuizSubmit}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="quiz-null">
                        <p>Sorry! You have already attempted the quiz.</p>
                    </div>
                )}
            </div>

            <div className="quiz-box" style={{ display: userFeedbackPage ? "block" : "none" }}>
                {quizId !== 0 && categoryId === 4 ? (
                    userQuiz?.map((data, index) => (
                        <div key={index}>
                            <div style={{ border: "1px solid #ccc", marginBottom: "10px", backgroundColor: "#e5eaf5", padding: "10px", width: "50%", marginLeft: "25%" }}>
                                <div
                                    key={index}
                                    style={{
                                        marginBottom: "20px",
                                        padding: "10px",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                    }}
                                >
                                    <div style={{ display: "flex", flexDirection: "row", gap: "15px" }}>
                                        <p>{index + 1 + "."}</p>
                                        <p>{data?.question}</p>
                                        <input
                                            type="textArea"
                                            name={"question"}
                                            value={QuizService.question}
                                            onChange={() => handleOptionChange(index, data?.question)}
                                        />
                                    </div>
                                    {/* <table className="table table-bordered table-hover">
                                        {[data?.option1, data?.option2, data?.option3, data?.option4].map((option, optIndex) => (
                                            <tr key={optIndex}>
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="col-2">
                                                            <input
                                                                type="radio"
                                                                id={`option-${optIndex}-${index}`}
                                                                name={`question-${index}`}
                                                                value={option}
                                                                onChange={() =>
                                                                    handleOptionChange(index, data?.question, option)
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col-10 text-start">
                                                            <label>{option}</label>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </table> */}
                                </div>
                                <button style={{ position: "fixed", bottom: "10%", right: "10%" }} onClick={handleQuizSubmit}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="quiz-null">
                        <p>Sorry! You have already attempted the Feedback</p>
                    </div>
                )}
            </div>



            <footer className="Footer-bar">@cms2024</footer>
        </div>
    );
};

export default UserQuiz;
