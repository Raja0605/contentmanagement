import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Legend, ResponsiveContainer } from "recharts";
import UserQuizService from "../Management/UserQuizService";
import './userHistory.css';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const COLORS = ["#4CAF50", "#FF5733"]; // Colors for Pie Chart

const UserHistorychart = () => {
  const [userHistory, setUserHistory] = useState([]);
  const [searchbar, setSearchbar] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    handleUserHistory();
  }, []);

  const handleUserHistory = async () => {
    try {
      const userHistoryResponse = await UserQuizService.fetchAllUserHistory();
      setUserHistory(userHistoryResponse?.data?.userHistoryDTO || []);
      console.log('User history fetched successfully');
    } catch (err) {
      console.log('Error fetching user history:', err);
    }
  };

  // Filtering based on search input
  const filteredUsers = userHistory.filter((item) =>
    ['userName', 'contentId', 'contentName', 'scores', 'rewardsPoint', 'attemptedDate']
      .some((key) => item[key]?.toString().toLowerCase().includes(searchbar.toLowerCase()))
  );

  // Calculate Pie Chart Data (Active vs. Inactive Users)
  const activeUsers = userHistory.filter(user => user.status === "Active").length;
  const inactiveUsers = userHistory.length - activeUsers;
  const userStatusData = [
    { name: "Active Users", value: activeUsers },
    { name: "Inactive Users", value: inactiveUsers }
  ];

  // Bar Chart Data (User Attempts)
  const userAttemptsData = userHistory.map(user => ({
    name: user.userName,
    attempts: user.scores || 0
  }));

  // Line Chart Data (User Engagement Over Time)
  const engagementData = userHistory.map(user => ({
    date: new Date(user.attemptedDate).toLocaleDateString(),
    engagement: user.rewardsPoint || 0
  }));

  return (
    <div className="userHistoryContainer">
      <div className="header">
        <button onClick={() => navigate(-1)} className="back-button">
          <IoArrowBackCircleSharp size={40} />
        </button>
        <h2>User History & Analytics</h2>
      </div>

      {/* Search Bar */}
      <input
        className="searchbar"
        type="text"
        placeholder="Search users..."
        value={searchbar}
        onChange={(e) => setSearchbar(e.target.value)}
      />

      {/* User History Table */}
      <table className="user-history-table">
        <thead >
          <tr>
            <th>UserName</th>
            <th>Content Id</th>
            <th>Content Name</th>
            <th>Scores</th>
            <th>Reward Points</th>
            <th>Attempted Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((item, index) => (
              <tr key={index}>
                <td>{item.userName}</td>
                <td>{item.contentId}</td>
                <td>{item.contentName}</td>
                <td>{item.scores}</td>
                <td>{item.rewardsPoint}</td>
                <td>{item.attemptedDate ? new Date(item.attemptedDate).toLocaleDateString() : "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">No data found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Analytics Section */}
      <div className="analytics-section">
        {/* Pie Chart - Active vs. Inactive Users */}
        <div className="chart-container">
          <h3>User Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={userStatusData} cx="50%" cy="50%" outerRadius={80} label dataKey="value">
                {userStatusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - User Performance Trends */}
        <div className="chart-container">
          <h3>Performance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userAttemptsData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attempts" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - User Engagement Over Time */}
        <div className="chart-container">
          <h3>Engagement Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="engagement" stroke="#A78BFA" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserHistorychart;
