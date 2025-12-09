import React, { useEffect, useState } from 'react'
import './AddMeme.css'
import { useNavigate } from 'react-router-dom'
import { IoArrowBackCircleSharp } from "react-icons/io5";
import axios from 'axios';
import QuizService from './QuizService';
import Swal from 'sweetalert2';
import './AddMeme.css'

function AddMeme() {
    const [memes,setMemes]=useState([])
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [currentMeme,setCurrentMeme] = useState({
        imageurl:"",
        caption:""
    })

    const handleInputChange =(e)=>{
        const { name, value } = e.target;
        console.log(`${name}: ${value}`); // Log each field update
        setCurrentMeme({ ...currentMeme, [name]: value });
    }

    const handleAddQuestion = () => {
        const{imageurl,caption} = currentMeme

        if(!imageurl || !caption){
        alert("Please fill in all fields before adding the question.");
        return;
        }

        if(isEditing){
            const updatedMemes = [...memes];
            updatedMemes[editIndex] = currentMeme;
            setMemes(updatedMemes);
            setIsEditing(false);
            setEditIndex(null);
        }else{
            setMemes([...memes, currentMeme]);
        }

        setCurrentMeme({
            imageurl:"",
            caption:""
          });
    }

    const handleEditQuestion = (index) => {
        setCurrentMeme(memes[index]);
        setIsEditing(true);
        setEditIndex(index);
      };

      const handleSubmitMeme = async () =>{
        if (memes.length === 0) {
            Swal.fire({text:"Please add at least one image before submitting.",
              icon:"warning"
            });
            return;
          }
      
          const payload = {
            // contentName: contentName,  // Send contentName separately
            jsonData: memes,  // Send questions as the content for jsonData
            status: 1,  // Adjust status as needed
            category: {
              categoryId: 3,  // Adjust categoryId as needed
            },
          };
      
          try {
            const response = await axios.post("http://localhost:2000/PostOnTwitter/createcontent", payload, {
              headers: {
                "Content-Type": "application/json",
              },
            });
            console.log("Payload:", payload);
            Swal.fire({
              title:"Success",
              text:"Memes submitted successfully!",
            icon:"success"});
            console.log(response.data);
            setMemes([]);
            // setContentName("");  // Reset contentName state
            setCurrentMeme({
             imageurl:"",
                caption: "",
            });
          } catch (error) {
            console.error("Error submitting Image:", error);
            Swal.fire({
              text:"Unable to submit image. Please try again.",
              icon:"error"});
            }
        };
      
        useEffect(() => {
            handleFetchAllContent();
          }, []);

          const handleFetchAllContent = async () => {
            try {
              const fetchresponse = await QuizService.fetchAllContent();
              console.log("fetchresponse", fetchresponse);
              // setQuizContent(fetchresponse.data);
              console.log("Records fetched successfully");
            } catch (err) {
              console.log("Unable to fetch the records");
            }
          };



  return (
    <div className='mecon'>
         <div style={{border:"none",backgroundColor:"transparent"} } onClick={()=>navigate(-1)}>
         <IoArrowBackCircleSharp style={{fontSize:"40px",borderRadius:"50%" ,backgroundColor:"#F8F8F8"}}/></div>
       
        <div className='containeer' style={{ justifyContent: "center", display: "flex"}}>
        <div className='imgurl-form'>
        <div><h3 className='p-add'>Add Memes</h3></div>
            <div className='sep-label'>
            <label htmlFor='imageurl' className='label-name'>Image URL:</label>
            <input

            className='input-box'
            type='text'
            placeholder='Enter image url'
            name='imageurl'
            id='imageurl'
            onChange={handleInputChange}
            value={currentMeme.imageurl}
            />
            </div>
            <div className='sep-label'>
            <label htmlFor='caption' className='label-name'>Caption:</label>
            <input

            className='input-box'
            type='text'
            placeholder='Enter caption'
            name='caption'
            id='caption'
            onChange={handleInputChange}
            value={currentMeme.caption}
            />
            </div>
            <button className='addbtn'
            onClick={handleAddQuestion}
            style={{backgroundColor: isEditing ? "#ffc107" : "#007bff"}}
            >Add List</button>
        </div>
        </div>
        <div style={{display:"flex",justifyContent:"center",width:"100%",}}>
        <div style={{ marginBottom: "20px",backgroundColor:"rgb(247, 244, 238)",width:"50%",borderRadius:"0px 0px 5px 5px"}}>
        <h2 style={{textAlign:"center"}}>Memes List</h2>
        {memes.length > 0 ? (
          <ul>
            {memes.map((q, index) => (
              <li key={index} style={{ marginBottom: "10px", display:"flex", justifyContent:"center"}}>
                <strong>Q{index + 1}: </strong> {q.memes}
                <ul>
                  <li>Image URL: {q.imageurl}</li>
                  <li>Caption: {q.caption}</li>
                </ul>
                <button
                  onClick={() => handleEditQuestion(index)}
                  style={{
                    backgroundColor: "#ffc107",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p >No questions added yet.</p>
          
        )}
        <div className='submeme'>
        <button className='subbtn'  onClick={handleSubmitMeme}>Submit </button></div>
      </div>
      
    </div>
    </div>
    )
}

export default AddMeme
