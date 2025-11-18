import { useState } from "react";
function App() {
  const [deviceNameInputValue, setDeviceNameInputValue] = useState("");
  const [devices, setDevices] = useState([
    "iPhone",
    "Mac",
    "Samsung",
    "Windows",
  ]);
  const devicesList = devices.map((device) => {
    return <li>{device}</li>;
  });
  function handleAddClick() {
    const newDevices = [...devices];
    newDevices.push(deviceNameInputValue);
    setDevices(newDevices);
  }
  return (
    <div style={{ textAlign: "center" }}>
      <ul style={{ display: "inline-block", padding: 0, marginTop: "300px" }}>
        {devicesList}
      </ul>
      <div style={{ marginTop: "50px" }}>
        <label>Device Name</label>
        <input
          value={deviceNameInputValue}
          onChange={(event) => {
            setDeviceNameInputValue(event.target.value);
          }}
        ></input>
        <button onClick={handleAddClick}>Add</button>
      </div>
    </div>
  );
}

export default App;
