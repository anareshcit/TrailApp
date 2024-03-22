import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Include Bootstrap CSS
// import { motion } from "framer-motion";
import "./Car.css"; // import the CSS file
import "./App.css";
// import Traffic_Light from "./Traffic_light.png";
// import Car_Image from "./car-image.png";
import POLO from "./polo.png";
import VENTO from "./vento.png";

const VehicleDataTable = () => {
  // const [isRedLight, setIsRedLight] = useState(true);
  const [responseData, setResponseData] = useState(null);
  // const inputRef = useRef(null);
  const [message, setMessage] = useState("");
  const tableRef = useRef(null);

  const handleClickOutside = (event) => {
    if (tableRef.current && !tableRef.current.contains(event.target)) {
      setSelectedVehicle(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [tableRef]); // Re-attach event listener on ref change (optional)

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
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleSpeeds, setVehicleSpeeds] = useState({}); // State for vehicle speeds
  const [vehicleLanes, setVehicleLanes] = useState({}); // State for vehicle lanes
  const [updateMessage, setUpdateMessage] = useState(null); // State for update message

  const handleUpdateSuccess = () => {
    setUpdateMessage("Update successful!"); // Set success message
    setTimeout(() => setUpdateMessage(null), 3000); // Hide message after 3 seconds
  };

  const handleVehicleClick = (vehicle) => {
    if (selectedVehicle?.id !== vehicle.id) {
      setSelectedVehicle(vehicle);
    } else {
      setSelectedVehicle(null); // Deselect if clicking the same row again
    }
  };

  const handleSpeedChange = (event, vehicleId) => {
    const newSpeed = event.target.value;
    setVehicleSpeeds({ ...vehicleSpeeds, [vehicleId]: newSpeed });
  };

  const handleSubmitSpeed = async (vehicleId, currentSpeed, currentLane) => {
    if (currentSpeed < 0 || currentLane > 10 || currentLane < 0) {
      return alert("Please enter a valid value(s):", currentSpeed, currentLane);
    }

    if (currentSpeed !== undefined) {
      try {
        const response = await axios.post(
          `http://localhost:5002/api/v1/vehicle/${vehicleId}/set_speed`,
          {
            speed: currentSpeed,
          }
        );
        if (response.status === 200) {
          handleUpdateSuccess(); // Call success handler on successful update
          // Check for successful update
          setVehicleSpeeds({ ...vehicleSpeeds, [vehicleId]: currentSpeed }); // Update state
        }
        console.log("Update response:", response); // Handle response (optional)
      } catch (error) {
        console.error("Error updating speed:", error);
      }
    }
    if (currentLane !== undefined) {
      try {
        const response = await axios.post(
          `http://localhost:5002/api/v1/vehicle/${vehicleId}/set_lane`,
          {
            lane: currentLane,
          }
        );
        if (response.status === 200) {
          handleUpdateSuccess(); // Call success handler on successful update
          setVehicleLanes({ ...vehicleLanes, [vehicleId]: currentLane }); // Update state
        }
        console.log("Update response:", response); // Handle response (optional)
      } catch (error) {
        console.error("Error updating lane:", error);
      }
    }
  };

  const handleLaneChange = async (event, vehicleId) => {
    const newLane = event.target.value;
    setVehicleLanes({ ...vehicleLanes, [vehicleId]: newLane }); // Update state
  };

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
      if (response.status !== 200) {
        alert("MQTT Subsription failed. please check!!!");
      }
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
      }, 500); // Change light every 2 seconds

      return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
    }, [currentLight]); // Run effect only when currentLight changes

    const getNextLight = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5002/api/traffic-light"
        );
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
          "http://localhost:5002/api/v1/vehicles"
        );
        setVehicleData(response.data.data.vehicle_list);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 2000); // Fetch data every 5 seconds

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
                <th>Lane_Position</th>
                <th>Speed</th>
                <th>Latitude</th>
                <th>Longitude</th>
                {/* Add more headers for other data as needed */}
              </tr>
            </thead>
            <tbody>
              {vehicleData.map((vehicle) => (
                <tr
                  className={
                    selectedVehicle && selectedVehicle.id === vehicle.id
                      ? "table-active"
                      : ""
                  }
                  key={vehicle.id}
                  onClick={() => handleVehicleClick(vehicle)}
                >
                  {/* Use a unique identifier for each vehicle */}
                  <td>{vehicle.id}</td>
                  <td>{vehicle.lane_position}</td>
                  <td style={{ color: vehicle.speed > 100 ? "red" : "black" }}>
                    {vehicle.speed}
                  </td>
                  <td>{vehicle.location.latitude}</td>
                  <td>{vehicle.location.longitude}</td>
                  {/* Add more table cells for other data */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section left-bottom">
        {/* Right Top: Traffic Signal Picture */}
        <div className="selected_vehicle">
          <h2>{selectedVehicle ? selectedVehicle.id.toUpperCase() : ""}</h2>
          <p>
            {selectedVehicle
              ? ""
              : "Please select a vehicle in the above table to view/update the details"}
          </p>
          <div>
            {/* Display update message */}
            {selectedVehicle && (
              <div>
                <ul>
                  {/* <p>
                    ID = {"\t"} {selectedVehicle.id}
                  </p> */}
                  <p>
                    Lane Position = {"\t"}
                    {/* {selectedVehicle?.id === vehicle.id ? ( */}
                    {/* <input
                      type="number"
                      value={
                        vehicleLanes[selectedVehicle.id] ||
                        selectedVehicle.lane_position
                      } // Use state or default
                      onChange={(event) =>
                        handleLaneChange(event, selectedVehicle.id)
                      }
                    /> */}
                    <select
                      value={
                        vehicleLanes[selectedVehicle.id] ||
                        selectedVehicle.lane_position
                      } // Use state or default
                      onChange={(event) =>
                        handleLaneChange(event, selectedVehicle.id)
                      }
                    >
                      <option value="1">Lane 1</option>
                      <option value="2">Lane 2</option>
                    </select>
                    {/* // ) // : ( // vehicle.lane_position // Use updated lane */}
                    {/* from state or default // )} */}
                  </p>
                  <p>
                    Speed = {"\t"}
                    {/* <input
                      type="number"
                      value={
                        vehicleSpeeds[selectedVehicle.id] ||
                        selectedVehicle.speed
                      } // Use state or default speed
                      onChange={(event) =>
                        handleSpeedChange(event, selectedVehicle.id)
                      }
                    /> */}
                    <select
                      value={
                        vehicleSpeeds[selectedVehicle.id] ||
                        selectedVehicle.speed
                      } // Use state or default speed
                      onChange={(event) =>
                        handleSpeedChange(event, selectedVehicle.id)
                      }
                    >
                      <option value="0">Speed 0</option>
                      <option value="1">Speed 1</option>
                      <option value="2">Speed 2</option>
                    </select>
                  </p>
                  <p>
                    Latitude = {"\t"}
                    {selectedVehicle.location.latitude}
                  </p>
                  <p>Longitude = {selectedVehicle.location.longitude}</p>
                  {/* Add more list items as needed for your vehicle data */}
                </ul>
                <button
                  style={submitButtonStyle}
                  onClick={() =>
                    handleSubmitSpeed(
                      selectedVehicle.id,
                      vehicleSpeeds[selectedVehicle.id],
                      vehicleLanes[selectedVehicle.id]
                    )
                  }
                >
                  Update
                </button>{" "}
                {updateMessage && (
                  <p className="update-message" style={{ color: "green" }}>
                    {updateMessage}
                  </p>
                )}
              </div>
            )}
            {/* <img
              src={Traffic_Light}
              alt="Traffic_Light"
              style={{ width: "200px", height: "200px" }}
            /> */}
          </div>
        </div>
      </div>
      <div className="section right-bottom">
        <p> {responseData}</p>
        {selectedVehicle?.id === "polo" ? (
          <img
            src={POLO}
            alt="POLO"
            style={{
              width: "800px",
              height: "500px",
            }}
          />
        ) : (
          <img
            src={VENTO}
            alt="VENTO"
            style={{ width: "800px", height: "500px" }}
          />
        )}
      </div>
    </div>
  );
};

export default VehicleDataTable;
