import { useNavigate } from "react-router-dom";


const BackButton = ({ children }) => {
    const navigate = useNavigate();
  
    const handleBackClick = () => {
      navigate(-1);
    };
  
    return (
      <div>
        <button onClick={handleBackClick}>Go Back</button>
        {children} {/* Render other components inside BackButton */}
      </div>
    );
  };
  
  export default BackButton;
  