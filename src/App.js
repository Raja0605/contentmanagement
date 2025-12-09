import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import MenuBar from './components/MenuBar/MenuBar';
import Dashboard from './components/Dashboard/Dashboard';
import User from './components/User/User';
import Management from './components/Management/Management';
import './App.css';
import Logout from './components/Logout/Logout';
import RegistrationForm from './components/User/RegistrationForm';
import Category from './components/Management/Category';
import Login from './components/Login/Login';
import Quiz from './components/Management/Quiz';
import QuizContent from './components/Management/QuizContent';
// import UserLogin from './components/Dashboard/UserLogin';
import UserQuiz from './components/Dashboard/UserQuiz';
import UserHistory from './components/UserHistory/UserHistory';
import UserVideoPage from './components/Dashboard/UserVideoPage';
import Video from './components/Management/Video';
import VideoContent from './components/Management/VideoContent';
import ResultsAnalytics from './components/Dashboard/ResultsAnalytics';
import UserHistorychart from './components/UserHistory/UserHistorychart';
import AddMeme from './components/Management/AddMeme';
import PostContent from './components/Management/PostContent';
import UserMemePage from './components/Dashboard/UserMemePage';
import FeedbackCreation from './components/Management/FeedbackCreation';
import UserFeedback from './components/Dashboard/UserFeedback';
// import UserMemes from './components/Dashboard/UserMemePage';


const App = () => {
  const [authenticated,setAuthenticate]= useState(localStorage.getItem('authenticated'))

  const handleLoginSuccess = () => {
    localStorage.setItem('authenticated',true)
    setAuthenticate(true)
  };

  const handleLogout = () => {
    localStorage.clear()
    setAuthenticate(false)
  };

  const ProtectedRoute = ({ element }) => {
    return authenticated ? element : <Navigate to="/" />;
  };

  return (
    <Router>
      <div className="app">
      
         
        {!authenticated || authenticated === false? (
         <Routes>
      <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/registrationForm" element={<RegistrationForm />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/userQuiz" element={<UserQuiz onLogout={handleLogout}/>} />
            <Route path='/userVideoPage' element={<UserVideoPage />} />
            <Route path='/feedbackRating' element={<UserFeedback/>}/>
            {/* <Route path="/UserMemes" element={<UserMemes/>}/> */}
           
          </Routes>
        ) : (
          <>
         
            {/* <Header /> */}
            <div className="main">
              <MenuBar onLogout={handleLogout} />
              <div className="content">
                <Routes>
                  
                  <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                  <Route path="/user" element={<ProtectedRoute element={<User />} />} />
                  <Route path="/management" element={<ProtectedRoute element={<Management />} />} />
                  <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
                  <Route path="/registrationForm" element={<ProtectedRoute element={<RegistrationForm />} />} />
                  <Route path="/category" element={<ProtectedRoute element={<Category />} />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                  <Route path='/quiz' element={<Quiz />} />
                  <Route path='/quizContent' element={<QuizContent  categoryId={1}/>}></Route>
                  <Route path='/userHistory' element={<UserHistory />} />
                  <Route path='/video' element={<Video />} />
                  <Route path='/videoContent' element={<VideoContent  categoryId={2} />} />
                  <Route path='/ResultsAnalytics' element={<ResultsAnalytics/>}/>
                  <Route path='/UserHistorychart' element={<UserHistorychart/>}/>
                  <Route path='/addMeme' element={<AddMeme/>}/>
                  <Route path='/postMeme' element={<PostContent categoryId={3}/>}/>
                  <Route path='/userMemePage' element={<UserMemePage/>}/>       
                  <Route path='/feedback' element={<FeedbackCreation/>}/>
                  </Routes>
              </div>
            </div>
            {/* <Footer /> */}
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
