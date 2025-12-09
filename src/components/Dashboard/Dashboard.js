import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import "./Dashboard.css"; // Import CSS
import UserQuizService from "../Management/UserQuizService";
import axios from "axios";

export default function Dashboard() {
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





  // const [count, setcount] = useState()
  // useEffect(() => {
  //   console.log("response", totalQuiz);
  //   setcount(totalQuiz)
  //   console.log("count", count);

  // }, [totalQuiz, count])

  // Fetch user history count and calculate total scores per user
  const handleUserHistorycount = async () => {
    try {
      const userHistorycount = await UserQuizService.fetchAllUserHistory();
      const userhistory = userHistorycount?.data?.userHistoryDTO || [];
      console.log("User History Data: ", userhistory);


      setLastname(localStorage.getItem("ad-or-lastname") || "");
      setFirstname(localStorage.getItem("ad-or-firstname") || "");
      const quizcount=localStorage.getItem("questioncount")

      setTotalParticipant(userHistorycount?.data?.totalCount || 0);

      // Create an object to store total scores per user
      const userScoresMap = {};

      userhistory.forEach(user => {
        const username = user.userName || "Unknown";
        const score = user.scores || 0;

        if (userScoresMap[username]) {
          userScoresMap[username] += score;
        } else {
          userScoresMap[username] = score;
        }
      });

      // Convert to an array and sort by highest total score
      const sortedUsers = Object.entries(userScoresMap)
        .map(([username, totalScore]) => ({ username, score: totalScore }))
        .sort((a, b) => b.score - a.score);
      console.log("sorted user----->", sortedUsers)

      setTopScores(sortedUsers.slice(0, 3)); // Get top 3 users
      const totaluser = sortedUsers.length;
      console.log("totaluser---------->", totaluser)
      

      // Calculate total average score
      const totalScoreSum = userhistory.reduce((sum, user) => sum + user.scores, 0);
      console.log("totalScoreSum------>", totalScoreSum)
      setTotalscores(totalScoreSum);

      // console.log("totalQuiz",totalQuiz)
      // console.log("------->",totaluser > 0 ? totalScoreSum / totalQuizz : 0)
    } catch (err) {
      console.log("Error fetching user history", err);
    }
  };

  // Fetch all content (Quizzes, Videos, Memes, Feedback)


  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        const quizResponse = await axios.get(`http://localhost:2000/PostOnTwitter/contentcategory/1`);
        const length = quizResponse?.data?.length;
        setTotalQuiz(localStorage.getItem("questioncount"));
        // setTotalQuizz(quizResponse?.data?.length)
        console.log(quizResponse?.data?.length)
        


        const videoResponse = await axios.get(`http://localhost:2000/PostOnTwitter/contentcategory/2`);
        setTotalVideos(videoResponse?.data?.length || 0);


        const memeResponse = await axios.get(`http://localhost:2000/PostOnTwitter/contentcategory/3`);
        setTotalMemes(memeResponse?.data?.length || 0);

        const feedbackResponse = await axios.get(`http://localhost:2000/PostOnTwitter/feedback/4`);
        setTotalFeedback(feedbackResponse?.data?.length || 0);
      } catch (err) {
        console.log("Unable to fetch content data");
      }
    };
    handleUserHistorycount();
    fetchAllContent();
  }, []);



  const dashboardData = {
    totalQuizzes: totalQuiz,
    totalParticipants: totalParticipant,
    averageScore: totalscores &&( (totalscores / totalQuiz) *10 ).toFixed(2),
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

  return (
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
          {/* <div className="dashboard-card">
            <p>Total Feedback</p>
            <p className="card-value">{totalFeedback}</p>
          </div> */}
          <div className="dashboard-card">
            <p>Average Score</p>
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
