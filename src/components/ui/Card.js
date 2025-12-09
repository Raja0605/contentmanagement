import "../ui/Card.css"; // Import Card CSS

export default function Card({ title, children }) {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      {children}
      
    </div>
  );
}
