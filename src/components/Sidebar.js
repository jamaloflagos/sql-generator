import React, { useState, useContext } from "react";
import { operations, objects } from "./data";
import { OutputContext } from "../App";
const Sidebar = ({ setOperation, setObject, className, toggleSidebar }) => {
  const [displayDropdown, setDisplayDropdown] = useState(false);
  const { setOutput } = useContext(OutputContext);
  return (
    <div className={className}>
      {operations.map((operation) => (
        <React.Fragment key={operation}>
          {operation === "CREATE" ? (
            <div className="dropdown">
              <button
                className="dropbtn"
                onClick={() => {
                  setOperation(operation);
                  setOutput("");
                  setDisplayDropdown((val) => !val);
                }}
              >
                {operation}
              </button>

              <div
                className={
                  displayDropdown ? "dropdown-content-display" : "dropdown-content"
                }
              >
                {objects.map((object) => (
                  <button
                    key={object}
                    onClick={() => {
                      toggleSidebar();
                      setObject(object);
                      setOutput("");
                    }}
                  >
                    {object}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              key={operation}
              onClick={() => {
                toggleSidebar();
                setDisplayDropdown(false);
                setOutput("");
                setOperation(operation);
              }}
            >
              {operation}
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Sidebar;
