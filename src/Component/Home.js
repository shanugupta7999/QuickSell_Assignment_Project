import React, { useEffect, useState } from "react";
import Card from "./card"; 
import "./Home.css";
import image1 from '../Asset/Display.svg'
import image2 from '../Asset/down.svg'
import threeDot from '../Asset/3 dot menu.svg'
import add from '../Asset/add.svg'
const Home = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [userFrequency, setUserFrequency] = useState({}); 
  const [statusFrequency, setStatusFrequency] = useState({});
  const [priorityFrequency, setPriorityFrequency] = useState({});
  const [selectedGrouping, setSelectedGrouping] = useState("status");
  const [selectedOrdering, setSelectedOrdering] = useState("priority");
  const [showDropdown, setShowDropdown] = useState(false); 

  const API_URL = "https://api.quicksell.co/v1/internal/frontend-assignment";

  const priorityLabels = {
    4: "Urgent",
    3: "High",
    2: "Medium",
    1: "Low",
    0: "No priority",
  };

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        
        const ticketsData = data.tickets.map((ticket) => ({
          id: ticket.id,
          title: ticket.title,
          tag: ticket.tag[0],
          status: ticket.status,
          priority: ticket.priority,
          userId: ticket.userId,
        }));

        const usersData = data.users;

        setTickets(ticketsData);
        setUsers(usersData);
        setFilteredTickets(ticketsData);
        calculateStatusFrequency(ticketsData);
        calculatePriorityFrequency(ticketsData);
        calculateUserFrequency(ticketsData, usersData); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const calculateStatusFrequency = (tickets) => {
    const frequency = tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {});

    const allStatuses = ["Todo", "Backlog", "In progress", "Done", "Cancelled"];
    allStatuses.forEach((status) => {
      if (!frequency[status]) frequency[status] = 0;
    });

    setStatusFrequency(frequency);
  };

  const calculatePriorityFrequency = (tickets) => {
    const frequency = tickets.reduce((acc, ticket) => {
      const priorityLabel = priorityLabels[ticket.priority] || "No priority";
      acc[priorityLabel] = (acc[priorityLabel] || 0) + 1;
      return acc;
    }, {});
    setPriorityFrequency(frequency);
  };

  const calculateUserFrequency = (tickets, users) => {
    const frequency = tickets.reduce((acc, ticket) => {
      acc[ticket.userId] = (acc[ticket.userId] || 0) + 1;
      return acc;
    }, {});

    const userFrequencyWithName = users.map((user) => ({
      name: user.name,
      count: frequency[user.id] || 0,
    }));

    setUserFrequency(userFrequencyWithName);
  };

  const handleFilterChange = () => {
    let filtered = tickets;

    if (selectedGrouping === "status") {
      filtered = tickets.sort((a, b) => a.status.localeCompare(b.status));
    } else if (selectedGrouping === "priority") {
      filtered = tickets.sort((a, b) => b.priority - a.priority);
    }

    setFilteredTickets(filtered);
  };

  const handleGroupingChange = (e) => {
    setSelectedGrouping(e.target.value);
  };

  const handleOrderingChange = (e) => {
    setSelectedOrdering(e.target.value);
    let sorted = [...filteredTickets];

    if (e.target.value === "priority") {
      
      sorted.sort((a, b) => b.priority - a.priority);
    } else if (e.target.value === "title") {
      
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredTickets(sorted);
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedGrouping]);

  const renderSecondHeader = () => {
    if (selectedGrouping === "status") {
      return ["Todo", "Backlog", "In progress", "Done", "Cancelled"].map((status) => (
        <div key={status} className="status-section">
          <h3>{status}</h3>
          <span>{statusFrequency[status] || 0}</span>
          <div className="temp">
          <img src={add} alt="Error Image" className="image" />
          <img src={threeDot} alt="Error Image" className="image" />
          </div>
          
        </div>
      ));
    } else if (selectedGrouping === "priority") {
      return Object.keys(priorityFrequency).map((priority) => (
        <div key={priority} className="priority-section">
          <h3>{priority}</h3>
          <span>{priorityFrequency[priority]}</span>
          <div className="temp">
          <img src={add} alt="Error Image" className="image" />
          <img src={threeDot} alt="Error Image" className="image" />
          </div>
        </div>
      ));
    } else if (selectedGrouping === "user") {
      return userFrequency.map((user) => (
        <div key={user.name} className="user-section">
          <h3>{user.name}</h3>
          <span>{user.count}</span>
          <div className="temp">
          <img src={add} alt="Error Image" className="image" />
          <img src={threeDot} alt="Error Image" className="image" />
          </div>
        </div>
      ));
    }
  };

  return (
    <div className="home-container">
      
      <div className="kanban-header">
        <button
          className="display-button"
          onClick={() => setShowDropdown((prev) => !prev)}
        ><img src={image1} alt="Image Error1" className="image1" />
          Display <img src={image2} alt="Image Error2" className="image2" />
        </button>
        {showDropdown && (
          <div className="dropdown">
            <div className="dropdown-group">
              <label htmlFor="grouping">Grouping:</label>
              <select id="grouping" onChange={handleGroupingChange} value={selectedGrouping}>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="dropdown-group">
              <label htmlFor="ordering">Ordering:</label>
              <select id="ordering" onChange={handleOrderingChange} value={selectedOrdering}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>

      
      <div className="second-header">{renderSecondHeader()}</div>

      
      <div className="kanban-column">
        {filteredTickets.map((ticket) => (
          <Card
            key={ticket.id}
            id={ticket.id}
            title={ticket.title}
            tag={ticket.tag}
            isChecked={false}
            onCheckChange={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
