import React from "react";
import "./card.css";

const Card = ({ id, title, tag, isChecked, onCheckChange }) => {
  return (
    <div className="card">
      <div className="header">
        <span className="header-text">{id}</span>
        <img
          src="https://via.placeholder.com/32" 
          alt="Profile"
          className="header-image"
        />
      </div>
      
      <div className="title-container">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onCheckChange} // This will trigger the callback from the parent
          className="checkbox"
        />
        <h2 className="title">{title}</h2>
      </div>
      
      <div className="footer">
        <div className="icon">
          <span className="icon-text">!</span>
        </div>
        
        <span className="tag">{tag}</span>
      </div>
    </div>
  );
};

export default Card;
