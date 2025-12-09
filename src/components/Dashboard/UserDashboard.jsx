import { useEffect, useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
  } from "recharts";
import QuizService from "../Management/QuizService";


export default function UserDashboard(){
     const [totalParticipant, setTotalParticipant] = useState(0);
      const [totalQuiz, setTotalQuiz] = useState(0);
      const [totalVideos, setTotalVideos] = useState(0);
      const [totalMemes, setTotalMemes] = useState(0);
      const [totalFeedback, setTotalFeedback] = useState(0);
      const [totalscores, setTotalscores] = useState(0);
      const [firstname, setFirstname] = useState("");
      const [lastname, setLastname] = useState("");
      const [topScores, setTopScores] = useState([]);
      const [totalQuizz, setTotalQuizz] = useState(0)



    const handleFetchUserHistoryById = async (userId) => {
        try {
            const fetchuserhistoryResponse = await QuizService.fetchUserHistoryById(userId);
           
        } catch (err) {
            console.error("Error fetching user history:", err);
        }
    };

    const dashboardData = {
        totalQuizzes: totalQuiz,
        totalParticipants: totalParticipant,
        averageScore: totalscores &&( (totalscores / totalQuiz) * 10).toFixed(2),
      };
    
      const averageScoreData = [
        { name: "Average Score", value: parseFloat(dashboardData.averageScore) },
        { name: "Remaining", value: 100 - parseFloat(dashboardData.averageScore) },
      ];
    
      // Bar chart data with total scores per user
      const barChartData = topScores.map(user => ({
        name: user.username,
        score: user.score,
      }));

      useEffect(()=>{
        UserDashboard();
        handleFetchUserHistoryById();
        },[])
    

    return(
         <div className="dashname">
              <div className="wh">
                <h4 className="h4">
                  Welcome Back {firstname} {lastname} !!
                </h4>
        
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
                  <div className="dashboard-card">
                    <p>Total Feedback</p>
                    <p className="card-value">{totalFeedback}</p>
                  </div>
                  <div className="dashboard-card">
                    <p>Total Score</p>
                    <p className="card-value">{dashboardData.averageScore}%</p>
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
                          data={averageScoreData}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          innerRadius={50}
                          label
                        >
                          <Cell fill="#6366F1" />
                          <Cell fill="#A78BFA" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
        
                  {/* Bar Chart for Total Scores */}
                  <div className="chart-container">
                    <h3>Total Scores Per User</h3>
                    <ResponsiveContainer width="90%" height={250}>
                      <BarChart data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
        
              </div>
            </div>
    );
}
