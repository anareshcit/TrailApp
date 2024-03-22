import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Include Bootstrap CSS
// import { motion } from "framer-motion";
import "./Car.css"; // import the CSS file
import "./App.css";
// import Traffic_Light from "./Traffic_light.png";
// import Car_Image from "./tesla.png";

const VehicleData2 = () => {
  // const [isRedLight, setIsRedLight] = useState(true);
  const [responseData, setResponseData] = useState(null);
  // const inputRef = useRef(null);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    try {
      const response = await axios.post("http://localhost:5002/api/message", {
        message,
      });
      console.log(response.status);
      setResponseData(response.data.status);
      //inputRef.current.value = "";
    } catch (error) {
      console.error(error);
    }
  };

  const [vehicleData, setVehicleData] = useState([]);
  const [currentLight, setCurrentLight] = useState("red"); // Initial light state

  const lightColors = {
    red: "#FF0000",
    yellow: "#FFFF00",
    green: "#00FF00",
  };
  const lightStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: lightColors[currentLight],
    margin: "100px auto",
  };
  const submitButtonStyle = {
    marginLeft: "10px", // Add some margin to separate the button from the dropdown
    padding: "8px 16px", // Add padding to make the button larger
    backgroundColor: "#003EFF", // Add a green background color
    color: "white", // Add white text color
    border: "none", // Remove the default button border
    borderRadius: "4px", // Add rounded corners
    cursor: "pointer", // Add pointer cursor on hover
  };
  const dropdownStyle = {
    padding: "8px 16px", // Add padding to make the dropdown larger
    border: "1px solid #4CAF50", // Add border matching button's color
    borderRadius: "4px", // Add rounded corners
  };

  // Clear response message after a delay (optional)
  useEffect(() => {
    initializeMqtt();
  }, []);

  const initializeMqtt = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5002/api/v1/mqtt/subscribe",
        {
          mqtt: "subscribe",
        }
      );
      console.log(response.status);
    } catch (error) {
      console.error(error);
    }
  };
  const TrafficBlink = () => {
    useEffect(() => {
      const intervalId = setInterval(() => {
        const nextLight = getNextLight();
        setCurrentLight(nextLight);
      }, 2000); // Change light every 2 seconds

      return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
    }, [currentLight]); // Run effect only when currentLight changes

    const getNextLight = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5002/api/traffic-light"
        ); // Replace with your API endpoint
        setCurrentLight(response.data.trafficLight);
      } catch (error) {
        console.error("Error fetching traffic data:", error);
      }
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5002/api/vehicle-data"
        ); // Replace with your API endpoint
        setVehicleData(response.data);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Cleanup function to stop interval on unmount-
  }, []);

  // Clear response message after a delay (optional)
  useEffect(() => {
    if (responseData) {
      const timeoutId = setTimeout(() => setResponseData(null), 3000); // Clear after 3 seconds (adjust as needed)
      return () => clearTimeout(timeoutId); // Cleanup function to clear timeout on unmount
    }
  }, [responseData]); // Run effect only when responseMessage changes

  return (
    <div className="dashboard">
      <div className="section left-top">
        {/* Left Top: Car Cockpit */}
        <div className="container">
          <h2>Vehicle Data</h2>
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>VID</th>
                <th>Speed</th>
                <th>Lane</th>
                <th>Latitude</th>
                <th>Longitude</th>
                {/* Add more headers for other data as needed */}
              </tr>
            </thead>
            <tbody>
              {vehicleData.map((vehicle) => (
                <tr key={vehicle.id}>
                  {" "}
                  {/* Use a unique identifier for each vehicle */}
                  <td>{vehicle.id}</td>
                  <td style={{ color: vehicle.speed > 100 ? "red" : "black" }}>
                    {vehicle.speed}
                  </td>
                  <td>{vehicle.lane}</td>
                  <td>{vehicle.latitude}</td>
                  <td>{vehicle.longitude}</td>
                  {/* Add more table cells for other data */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="section left-bottom">
        {/* Left Bottom: Vehicle Data */}
        <div className="vehicle-data">
          <h2>Send Traffic Status</h2>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Add any vehicle data elements */}
            <select
              style={dropdownStyle}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            >
              <option value="">--Please choose an option--</option>
              <option value="red">Red</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
            </select>
            <button style={submitButtonStyle} onClick={sendMessage}>
              Send Signal State
            </button>
          </div>
          <p> {responseData}</p>
          {/* <img
            src={Car_Image}
            alt="Car_Image"
            style={{ width: "1000px", height: "500px" }}
          /> */}
        </div>
      </div>
      <div className="section right-top">
        {/* Right Top: Traffic Signal Picture */}
        <div className="traffic-signal-picture">
          <h2>Traffic Signal Picture</h2>
          <div>
            {/* <img
              src={Traffic_Light}
              alt="Traffic_Light"
              style={{ width: "200px", height: "200px" }}
            /> */}
          </div>
        </div>
      </div>
      <div className="section right-bottom">
        {/* Right Bottom: Traffic Details */}
        <div>
          <h2>Received Traffic Status</h2>
          <div style={lightStyle}>
            <TrafficBlink />
          </div>
          {/* Add any traffic details */}
        </div>
      </div>
    </div>
  );
};

export default VehicleData2;
