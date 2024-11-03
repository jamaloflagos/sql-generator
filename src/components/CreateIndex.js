import React, { useContext, useState } from "react";
import { create } from "../functions";
import { OutputContext } from "../App";

const CreateIndex = ({ object }) => {
  const { setOutput } = useContext(OutputContext);
  const [indexName, setIndexName] = useState("");
  const [indexTableName, setIndexTableName] = useState("");
  const [indexColumns, setIndexColumns] = useState([]);
  const [currentColumn, setCurrentColumn] = useState("");

  const addColumn = () => {
    if (currentColumn) {
      setIndexColumns([...indexColumns, currentColumn]);
      setCurrentColumn("");
    }
  };

  const removeColumn = (index) => {
    const newColumns = indexColumns.filter((_, i) => i !== index);
    setIndexColumns(newColumns);
  };

  const handleSubmit = () => {
    if (indexName && indexTableName && indexColumns.length > 0) {
      const output = create(object, indexName, indexTableName, indexColumns);
      setOutput(output);
    }
  };

  return (
    <div>
      <h1>Create Index</h1>
      <div>
        <input
          type="text"
          placeholder="Index Name"
          value={indexName}
          onChange={(e) => setIndexName(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Table Name"
          value={indexTableName}
          onChange={(e) => setIndexTableName(e.target.value)}
        />
      </div>
      <div>
        <h2>Columns</h2>
        {indexColumns.map((column, index) => (
          <div key={index}>
            <span>{column}</span>
            <button type="button" onClick={() => removeColumn(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Column"
          value={currentColumn}
          onChange={(e) => setCurrentColumn(e.target.value)}
        />
        <button type="button" onClick={addColumn}>
          Add Column
        </button>
      </div>
      <div>
        <button type="button" onClick={handleSubmit}>
          Generate SQL
        </button>
      </div>
    </div>
  );
};

export default CreateIndex;
