import React from 'react';
import './Management.css';
import { useNavigate } from 'react-router-dom';
import { BiSolidCategory,BiSolidVideos  } from "react-icons/bi";
import { FaPencilAlt , FaClipboardList,FaPhotoVideo } from "react-icons/fa";
import { LiaImages } from "react-icons/lia";
import { FaHourglassEnd } from "react-icons/fa6";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const Management = () => {

  const navi = useNavigate();
  const navigate = useNavigate();

  const handleCategory = () => {
    navi('/category');
  };

  const handleQuiz = () => {
    navi('/quiz');
  };

  const handleQuizContent = () => {
    navi('/quizContent');
  };

  // const handleUserHistoryPage=()=>{
  //   navi('/userHistory');
  // };

  const handleVideo = () => {
    navi('/video');
  };

  const handleVideoContent = () => {
    navi('/videoContent');
  };
  const handleAddMeme = () =>{
    navi('/addMeme')
  };
  const handlePostMeme = () =>{
    navi('/postMeme')
  };

  const handleFeedbackcreation = () =>{
    navi('/feedback')
  }

  return (

    <div className="user">
        <div style={{border:"none",backgroundColor:"transparent",color:"black"}} onClick={()=>navigate(-1)}>
    <IoArrowBackCircleSharp style={{fontSize:"40px" ,color:"white"}}/>
 
    </div>
      <div className='mg' >
     
        <div className='mg-cantainer'>
       
            <button className='mg-btn' onClick={handleCategory}><BiSolidCategory style={{color:"black",fontSize:"35px", }}/>Category</button>
        </div>

        <div className='mg-cantainer'>
          <button className='mg-btn' onClick={handleQuiz}><FaPencilAlt style={{color:"black",fontSize:"35px", }} />Add Quiz</button>
        </div>


        <div className='mg-cantainer'>
          <button className='mg-btn' onClick={handleQuizContent}><FaClipboardList style={{color:"black",fontSize:"35px", }} />Post Quiz</button>
      
        </div>

        <div className='mg-cantainer' >
           <button className='mg-btn' onClick={handleVideo}><FaPhotoVideo style={{color:"black",fontSize:"35px", }}/>Add Video</button>
          
        </div>

        <div className='mg-cantainer'>
          <button className="mg-btn" onClick={handleVideoContent}><BiSolidVideos style={{color:"black",fontSize:"35px", }}/>Post Video</button>
        </div>

        <div className='mg-cantainer'>
            <button className='mg-btn' onClick={handleAddMeme}><LiaImages style={{color:"black",fontSize:"35px", }}/>Add Memes</button>
        </div>

        <div className='mg-cantainer'>
            <button className='mg-btn' onClick={handlePostMeme}><FaHourglassEnd style={{color:"black",fontSize:"35px", }}/>Post Memes</button>
        </div>

        {/* <div className='mg-cantainer'>
            <button className='mg-btn' onClick={handleFeedbackcreation} >FeedBack</button>
        </div> */}

        {/* <button onClick={handleUserHistoryPage}>User History</button> */}


      </div>
    </div>
  );

};

export default Management;
