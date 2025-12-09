import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import "./VideoEditor.css"


const Video = () => {
    const [videos, setVideos] = useState([]);
    const navigate=useNavigate();
    const [currentVideo, setCurrentVideo] = useState({
      title: "",
      description: "",
      videoUrl: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCurrentVideo({ ...currentVideo, [name]: value });
    };
  
    const handleAddVideo = () => {
      const { title, description, videoUrl } = currentVideo;
  
      if (!title || !description || !videoUrl) {
        alert("Please fill in all fields before adding the video.");
        return;
      }
  
      if (isEditing) {
        const updatedVideos = [...videos];
        updatedVideos[editIndex] = currentVideo;
        setVideos(updatedVideos);
        setIsEditing(false);
        setEditIndex(null);
      } else {
        setVideos([...videos, currentVideo]);
      }
  
      setCurrentVideo({
        title: "",
        description: "",
        videoUrl: "",
      });
    };
  
    const handleEditVideo = (index) => {
      setCurrentVideo(videos[index]);
      setIsEditing(true);
      setEditIndex(index);
    };
  
    const handleSubmitVideos = async () => {
      if (videos.length === 0) {
        alert("Please add at least one video before submitting.");
        return;
      }
  
      const payload = {
        jsonData: videos,
        status: 1,
        category: {
          categoryId: 2,
        },
      };
  
      try {
        const response = await axios.post("http://localhost:2000/PostOnTwitter/createcontent", payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        alert("Videos submitted successfully!");
        console.log(response.data);
        setVideos([]);
      } catch (error) {
        console.error("Error submitting videos:", error);
        alert("Unable to submit videos. Please try again.");
      }
    };
  
    return (
      <div className="video-editor-container">
      <div className="back-button" onClick={() => navigate(-1)}>
        <IoArrowBackCircleSharp className="back-icon" />
      </div>
    
      <div className="video-form">
        <h3>Video Creation</h3>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={currentVideo.title}
          onChange={handleInputChange}
          placeholder="Enter the video title"
        />
    
        <label>Description:</label>
        <textarea
          name="description"
          value={currentVideo.description}
          onChange={handleInputChange}
          placeholder="Enter the video description"
        />
    
        <label>Video URL:</label>
        <input
          type="text"
          name="videoUrl"
          value={currentVideo.videoUrl}
          onChange={handleInputChange}
          placeholder="Enter the video URL"
        />
    
        <button
          onClick={handleAddVideo}
          className={`video-button ${isEditing ? "update-video-button" : "add-video-button"}`}
        >
          {isEditing ? "Update Video" : "Add Video"}
        </button>
      </div>
    
      <div className="video-list">
        <h2>Videos List</h2>
        {videos.length > 0 ? (
          <ul>
            {videos.map((v, index) => (
              <li key={index} className="video-item">
                <strong>Title:</strong> {v.title} <br />
                <strong>Description:</strong> {v.description} <br />
                <strong>URL:</strong> <a href={v.videoUrl} target="_blank" rel="noopener noreferrer">{v.videoUrl}</a>
                <br />
                <button onClick={() => handleEditVideo(index)} className="edit-button">
                  Edit
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No videos added yet.</p>
        )}
      </div>
    
      <button onClick={handleSubmitVideos} className="video-button submit-video-button">
        Submit Videos
      </button>
    </div>
    
    );
  };
  
  export default Video;
  