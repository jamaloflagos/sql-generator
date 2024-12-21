import Sidebar from './components/Sidebar';
import Input from './components/Input';
import { createContext, useState } from 'react';
import Output from './components/Output';

export const OutputContext = createContext();

function App() {
  const [operation, setOperation] = useState();
  const [object, setObject] = useState('');
  const [output, setOutput] = useState('');
  const outputContextValue = { output, setOutput };
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="App">
      <OutputContext.Provider value={outputContextValue}>
      <div className='sidebar_form_div'>
        <button onClick={toggleSidebar} className="toggle_button">
          {isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
        </button>
        <Sidebar setOperation={setOperation} setObject={setObject} toggleSidebar={toggleSidebar} className={`sidebar ${isSidebarVisible ? 'open' : 'collapsed'}`}/>
        <div className='form'>

        <Input operation={operation} object={object} />
        </div>
      </div>
      <Output />
      </OutputContext.Provider>
    </div>
  );
}

export default App;
