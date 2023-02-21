import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import PacketTable from "./PacketTable";
import FilterRules from "./FilterRules";

const ENDPOINT = "http://localhost:5000"; // Replace with your own websocket endpoint

function App() {
  const [packets, setPackets] = useState([]);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    // Listen for packet events from the server
    socket.on("packet", (packet) => {
      setPackets((prevPackets) => [...prevPackets, packet]);
    });

    // Listen for rule events from the server
    socket.on("rule", (rule) => {
      setRules((prevRules) => [...prevRules, rule]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const addRule = (rule) => {
    setRules((prevRules) => [...prevRules, rule]);
    socket.emit("add-rule", rule);
  };

  const removeRule = (index) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
    socket.emit("remove-rule", index);
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Packet Analyzer</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">Packets</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Filter Rules</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="row mt-3">
        <div className="col">
          <PacketTable packets={packets} />
        </div>
        <div className="col">
          <FilterRules rules={rules} onAddRule={addRule} onRemoveRule={removeRule} />
        </div>
      </div>
    </div>
  );
}

export default App;
