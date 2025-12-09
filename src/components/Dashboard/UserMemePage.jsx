import React, { useEffect, useState } from "react";
import UserQuizService from "../Management/UserQuizService";
import QuizService from '../Management/QuizService';
import "./Usermemepage.css";

const UserMemes = () => {
    const [userMemes, setUserMemes] = useState([]);
    const [contentId, setContentId] = useState(null);
    const [categoryId, setCategoryId] = useState();
    const [showMemes, setShowMemes] = useState(false);
    const [loading, setLoading] = useState(true);

    const baseurl = "http://localhost:2000/PostOnTwitter/image?imagePath=";
    const userId = localStorage.getItem('userId');
    useEffect(() => {
        const fetchMemes = async () => {
            try {
                const fetchResponse = await UserQuizService.fetchContentById('memes');
                const imageResponse = fetchResponse?.data?.jsonData || [];
                console.log("Image response:", imageResponse);

                setCategoryId(fetchResponse?.data?.category?.categoryId);
               
                if (Array.isArray(imageResponse) && imageResponse.length > 0) {
                    setUserMemes(imageResponse);
                } else {
                    setUserMemes([]);
                }

                setContentId(fetchResponse?.data?.contentId || null);
            } catch (err) {
                console.log('Content is not defined:', err);
            }
        };

        fetchMemes();

        // Delay showing memes by 5 seconds
        setTimeout(() => {
            setShowMemes(true);
            setLoading(false);
        }, 5000);
    }, []);

    const handleFinish = async () => {
        try {
            const payload = {
                userId,
             contentId,
            
            };
            console.log("Sending payload:", payload); // Debugging log

          const response=  await QuizService.createUserVideoHistory(payload);
            console.log("Reward points sent:", response);
            console.log("API Response:", response); // Debugging log
            if(response.data.success){
                alert("Reward points successfully sent!");
            }
           else{
            alert(response.data.message)
           }
        } catch (err) {
            console.log("Error sending reward:", err);
        }
    };

    return (
        <div className="memes-container">
            {loading ? (
                <p>Loading memes...</p>
            ) : categoryId === 3 ? (
                showMemes && userMemes.length > 0 ? (
                    userMemes.map((data, index) => (
                        <div key={index} className="meme-card">
                            <div className="meme-content">
                                <img
                                    src={`${baseurl}${encodeURIComponent(data?.imageurl)}`}
                                    width="300"
                                    height="340"
                                    alt="Meme"
                                    className="meme-image"
                                />
                                <p className="meme-caption">{data?.caption}</p>
                            </div>
                            <button onClick={handleFinish} className="finish-btn">Finish</button>
                        </div>
                    ))
                ) : (
                    <p className="no-memes">No memes available.</p>
                )
            ) : (
                <div className="quiz-null">
                    <p>Your response has been sent.</p>
                </div>
            )}
        </div>
    );
};

export default UserMemes;
