import Sidebar from './components/Sidebar';
import Form from './components/Input';
import { createContext, useState } from 'react';
import Output from './components/Output';

export const OutputContext = createContext()

function App() {
  const [op, setOp] = useState();
  const [object, setObject] = useState('');
  const [output, setOutput] = useState('');
  const outputContextValue = { output, setOutput };
  return (
    <div className="App">
      <OutputContext.Provider value={outputContextValue}>
        <Sidebar setOp={setOp} setObject={setObject} />
        <Form op={op} object={object} />
        <Output />
      </OutputContext.Provider>
    </div>
  );
}

export default App;
