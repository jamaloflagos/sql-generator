import { useState, useContext } from "react";
import { insert } from "../functions";
import { OutputContext } from "../App";
const Insert = () => {
    const [tableName, setTableName] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [columns, setColumns] = useState([{ name: '', type: 'name', blankPercentage: 0 }]);
  const { setOutput } = useContext(OutputContext);

  const handleColumnChange = (index, field, value) => {
    const newColumns = [...columns];
    newColumns[index][field] = value;
    setColumns(newColumns);
  };

  const addColumn = () => {
    setColumns([...columns, { name: '', type: '', blankPercentage: 0 }]);
  };

  const generateSQL = () => {
    const output = insert(rowCount, tableName, columns);
    setOutput(output);
  };
  return (
    <div>
      <h1>SQL Insert Statement Generator</h1>

      <div>
        <label>Table Name:</label>
        <input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
        />
      </div>

      <div>
        <label>Number of Rows:</label>
        <input
          type="text"
          value={rowCount}
          onChange={(e) => setRowCount(Number(e.target.value))}
        />
      </div>

      {columns.map((column, index) => (
        <div key={index}>
          <label>Column Name:</label>
          <input
            type="text"
            value={column.name}
            onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
          />

          <label>Type:</label>
          <select
            value={column.type}
            onChange={(e) => handleColumnChange(index, 'type', e.target.value)}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="phone_number">Phone Number</option>
            <option value="integer">Integer</option>
          </select>

          <label>Blank Percentage:</label>
          <input
            type="text"
            value={column.blankPercentage}
            onChange={(e) => handleColumnChange(index, 'blankPercentage', Number(e.target.value))}
            min="0"
            max="100"
          />

          <button onClick={addColumn}>Add Another Column</button>
        </div>
      ))}

      <button onClick={generateSQL}>Generate SQL</button>
    </div>
  )
}
export default Insert