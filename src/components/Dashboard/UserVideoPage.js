import React, { useState, useRef, useEffect } from 'react';
import UserQuizService from '../Management/UserQuizService';
import QuizService from '../Management/QuizService';
import "./UserVideo.css"
import { FaPlay,FaPause } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";

const UserVideoPage = () => {
  const videoRef = useRef(null);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [userVideo, setUserVideo] = useState('');
  const [contentId, setContentId] = useState(null);

  const userId = localStorage.getItem('userId');
  const baseurl = "http://localhost:2000/PostOnTwitter/stream/";

  const fetchContent = async () => {
    try {
      const fetchResponse = await UserQuizService.fetchContentById('video');
      const videoResponse = fetchResponse?.data?.jsonData || [];

      console.log("Video response:", videoResponse);

      // if (videoResponse !== null && videoResponse.length > 0) {
      //   setUserVideo(videoResponse[0]?.);
      // } else {
      //   setUserVideo('');
      // }

      setContentId(fetchResponse?.data?.contentId || null);
      setShowVideo(true);
    } catch (err) {
      console.log('Content is not defined:', err);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handlePlay = () => {
    if (videoRef.current) videoRef.current.play();
  };

  const handlePause = () => {
    if (videoRef.current) videoRef.current.pause();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      if (duration > 0) {
        setWatchedPercentage((currentTime / duration) * 100);
      }
    }
  };

  const handleEnded = async () => {
    setIsVideoEnded(true);

    if (!videoRef.current || isNaN(videoRef.current.duration)) {
      console.warn("Invalid video duration");
      return;
    }

    const payload = {
      userId,
      contentId,
      watchedDuration: videoRef.current.duration,
      watchedPercentage: 100
    };

    try {
      const response = await QuizService.createUserVideoHistory(payload);
      console.log("Video history response:", response);
      if (response.data.success) {
        alert(`Video history saved: ${response.data.message}`);
      
          handleEnded();
       
        
        
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error saving video history:", error);
    }
  };

  return (
    <>
      {contentId ? (
        showVideo && (
          <div className="videopage" style={{overflow:"hidden"}}>
            <div style={{ position: "relative", width: "600px",height:"100vh" }}>
              {/* Video Player */}
              <video
                ref={videoRef}
                width="600"
                height="340"
                muted
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                controls
                style={{ display: "block" }}
              >
                <source src={`${baseurl}${contentId}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Custom Progress Bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "0",
                  width: "100%",
                  height: "8px",
                  background: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${watchedPercentage}%`,
                    height: "100%",
                    background: "red",
                    transition: "width 0.2s ease-in-out",
                  }}
                ></div>
              </div>
              <div className='video-btn'>
              <button className='play-btn' onClick={handlePlay}><FaPlay /></button>
              <button className='pause-btn' onClick={handlePause}><FaPause /></button>
              <button disabled={!isVideoEnded} onClick={() => alert("Next Step")}>
              <TbPlayerTrackNextFilled />
            </button>
            </div>
            </div>

            {/* Play/Pause Buttons */}
           

            {/* Next Button */}
           
          </div>
        )
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="quiz-null">
            <p>Sorry! Today's video content is over.<br />Next video will stream tomorrow.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default UserVideoPage;
