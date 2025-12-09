import { useEffect, useState } from "react";
import UserQuizService from "../Management/UserQuizService";
import './userHistory.css';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdManageSearch  } from "react-icons/md";
// import ResultsAnalytics from "../Dashboard/ResultsAnalytics";
// import UserHistorychart from "./UserHistorychart";

const UserHistory = () => {
  const [userHistory, setUserHistory] = useState([]);
  const [searchbar, setSearchbar] = useState(''); // Added missing state
  const navigate = useNavigate();
  
  const calculateQuestionLength = (userHistories) => {
    return userHistories.reduce((count, userHistory) => count + (userHistory.jsonData?.length || 0), 0);
  };
  
  const handleUserHistory = async () => {
    try {
      const userHistoryResponse = await UserQuizService.fetchAllUserHistory();
      console.log("userDetails----------------------->", userHistoryResponse.data.userHistoryDTO);

      setUserHistory(userHistoryResponse?.data?.userHistoryDTO || []);
      console.log('user history fetched successfully');
      console.log('user history------->',calculateQuestionLength(userHistoryResponse?.data?.userHistoryDTO));
      localStorage.setItem("questioncount",calculateQuestionLength(userHistoryResponse?.data?.userHistoryDTO));
    } catch (err) {
      console.log('Error, while fetching all user');
    }
  };

  useEffect(() => {
    handleUserHistory();
  }, []);

  // Filtering the userHistory based on search input
  const filteredUsers = userHistory.filter((item) =>
    ['userName', 'contentId', 'contentName', 'scores', 'rewardsPoint', 'attemptedDate']
      .some((key) => item[key]?.toString().toLowerCase().includes(searchbar.toLowerCase()))
  );

  return (
    <div>
       
      <div className="userHistory"> 
        <div className="user-header">
        <div style={{border:"none",backgroundColor:"transparent",color:"black"}} onClick={()=>navigate(-1)}>
    <IoArrowBackCircleSharp style={{fontSize:"40px" ,color:"white"}}/>
 
    </div>
          <input
            className="searchbar"
            type="text"
            placeholder="Search users..."
            value={searchbar}
            onChange={(e) => setSearchbar(e.target.value)}
          />
          <MdManageSearch className='search-icon'/>
        </div>

        <table className="admin-table">
  <thead className="admin-table-header">
    <tr>
      <th>User Name</th>
      <th>Content ID</th>
      <th>Content Name</th>
      <th>Scores</th>
      <th>Reward Points</th>
      <th>Attempted Date</th>
    </tr>
  </thead>
  <tbody className="admin-table-body">
    {filteredUsers.length > 0 ? (
      filteredUsers.map((item, index) => (
        <tr key={index} className="admin-table-row">
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
      ))
    ) : (
      <tr>
        <td colSpan="6" className="no-data">No data found</td>
      </tr>
    )}
  </tbody>
</table>

      </div>
     
    </div>
  );
};

export default UserHistory;
