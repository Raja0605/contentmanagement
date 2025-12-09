import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";


const leaderboardData = [
  { rank: 1, name: "Alice", score: 95 },
  { rank: 2, name: "Bob", score: 90 },
  { rank: 3, name: "Charlie", score: 85 },
];

const performanceData = [
  { quiz: "Quiz 1", score: 80 },
  { quiz: "Quiz 2", score: 90 },
  { quiz: "Quiz 3", score: 85 },
];

const ResultsAnalytics = () => {
  return (
    <div className="results-container">
      <h2>Results & Analytics</h2>

      {/* Leaderboard */}
      <div className="leaderboard">
        <h3>Leaderboard</h3>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user, index) => (
              <tr key={index}>
                <td>{user.rank}</td>
                <td>{user.name}</td>
                <td>{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Individual Quiz Performance */}
      <div className="performance-chart">
        <h3>Individual Quiz Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <XAxis dataKey="quiz" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Export Report */}
      <div className="export-btn">
        <button onClick={() => alert("Exporting Report...")}>Export Reports</button>
      </div>
    </div>
  );
};

export default ResultsAnalytics;
