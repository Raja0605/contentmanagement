import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate, useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import "./VideoContent.css";

// Postimage Component
const Postimage = ({ closePopup, quizId }) => {
  const [imageUrl, setImageUrl] = useState("");
  const caption = `http://localhost:3000/userquiz/${quizId}`;
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please provide an image URL.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:2000/PostOnTwitter/postimage?imageUrl=${encodeURIComponent(
          imageUrl
        )}&caption=${encodeURIComponent(caption)}`
      );
      setResponseMessage(response.data.message || "Image posted successfully!");
    } catch (error) {
      setResponseMessage(
        `Error: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div
      className="post-card"
      style={{
        position: "fixed",
        backgroundColor: "#f9f9f9",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "20px",
        zIndex: 8888,
        width: "400px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div className="heading">
        <h3>INSTAGRAM POST</h3>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <div>
              <label>Image URL</label>
              <input
                type="text"
                onChange={(e) => setImageUrl(e.target.value)}
                value={imageUrl}
                placeholder="Enter The Image URL"
                name="imageUrl"
                required
              />
            </div>
            <div>
              <label>Caption</label>
              <input
                type="text"
                value={caption}
                readOnly
                name="caption"
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn btn-primary" type="submit">
                POST
              </button>
              <button className="btn btn-secondary" onClick={closePopup}>
                Close
              </button>
            </div>
          </div>
          {responseMessage && <p className="mt-2 text-danger">{responseMessage}</p>}
        </form>
      </div>
    </div>
  );
};

// VideoContent Component
const VideoContent = ({ categoryId }) => {
  const [videoCon, setVideoCon] = useState([]);
  const [showPostImage, setShowPostImage] = useState(false);
  const [quizId, setQuizId] = useState("");
  const navigate=useNavigate();

  useEffect(() => {
    handleFetchAllContent();
  }, [categoryId]);

  const handleFetchAllContent = async () => {
    console.log(categoryId);
    try {
      const response = await axios.get(
        `http://localhost:2000/PostOnTwitter/contentcategory/${categoryId}`
      );
      console.log(response.data);
      const videoContent = response.data.filter(
        (item) => item.category?.categoryName === "Video"
      );
      console.log(videoContent);
      setVideoCon(videoContent);
    } catch (err) {
      console.error("Error fetching content:", err);
    }
  };

  const handlePostImage = (quizId) => {
    setShowPostImage(true);
    setQuizId(quizId);
  };

  const handleCancelPostImage = () => {
    setShowPostImage(false);
    setQuizId("");
  };

  return (
    <div>
  {/* Back Button */}
  <div className="back-button" onClick={() => navigate(-1)}>
    <IoArrowBackCircleSharp className="back-icon" />
  </div>

  <div className="video-content-container">
    {videoCon.length > 0 ? (
      videoCon.map((item, index) => (
        <div key={index} className="video-content-box">
          <h4>Content ID: {item.contentId}</h4>
          {item.jsonData?.map((data, dataIndex) => (
            <div key={dataIndex} className="video-details">
              <p><strong>Video Name:</strong> {data.title}</p>
              <p>
                <strong>URL:</strong> <a href={data.videoUrl} target="_blank" rel="noopener noreferrer">{data.videoUrl}</a>
              </p>
              <p><strong>Description:</strong> {data.description || "N/A"}</p>
              <button
                className="publish-button"
                onClick={() => handlePostImage(item.contentId)}
              >
                Publish Link
              </button>
            </div>
          ))}
        </div>
      ))
    ) : (
      <p className="no-content-message">No video content available.</p>
    )}

    {showPostImage && <Postimage closePopup={handleCancelPostImage} quizId={quizId} />}
  </div>
</div>

  );
};

export default VideoContent;
