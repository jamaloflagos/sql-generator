import React, { useState, useContext } from 'react'; // Import React for JSX syntax
import { operations, objects } from './data';
import { OutputContext } from "../App";
const Sidebar = ({ setOp, setObject }) => {
  const [displayDD, setDisplayDD] = useState(false);
  const { setOutput } = useContext(OutputContext);
  return (
    <div className="sidebar"> 
      {operations.map((operation) => ( 
        <React.Fragment key={operation}>
          {operation === 'CREATE' ? (
            <div className="dropdown"> 
              <button className="dropbtn" onClick={() => {
                setOp(operation);
                setOutput('');
                setDisplayDD(val => !val);
              }}>
                {operation}
              </button>
                
              <div className={displayDD ? 'dropdown-content-display' : 'dropdown-content'}>
                {objects.map(object => (
                  <button key={object} onClick={() => {setObject(object); setOutput('')}}>{object}</button>
                ))}
              </div>
            </div>
          ) : (
            <button key={operation} onClick={() => {setDisplayDD(false); setOutput(''); setOp(operation)}}>
              {operation}
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Sidebar;
