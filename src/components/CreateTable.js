import React, { useContext, useState } from "react";
import { create } from "../functions";
import { OutputContext } from "../App";

const CreateTable = ({ object }) => {
  const { setOutput } = useContext(OutputContext);
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([]);
  const [columnName, setColumnName] = useState("");
  const [dataType, setDataType] = useState("");
  const [charLength, setCharLength] = useState("");
  const [constraints, setConstraints] = useState([]);
  const [checkCondition, setCheckCondition] = useState("");
  const [refTableName, setRefTableName] = useState("");
  const [refTableCol, setRefTableCol] = useState("");

  const availableConstraints = [
    "NOT NULL",
    "UNIQUE",
    "PRIMARY KEY",
    "FOREIGN KEY",
    "CHECK",
  ];

  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      if (value !== "CHECK" && value !== "FOREIGN KEY") {
        setConstraints([...constraints, value]);
      } else {
        setConstraints([...constraints, value]);
      }
    } else {
      setConstraints(
        constraints.filter((constraint) => !constraint.startsWith(value))
      );
    }
  };

  const handleConstraintInputChange = (constraintType, event) => {
    if (constraintType === "CHECK") {
      setCheckCondition(event.target.value);
    } else if (constraintType === "FOREIGN KEY") {
      if (event.target.name === "refTableName") {
        setRefTableName(event.target.value);
      } else if (event.target.name === "refTableCol") {
        setRefTableCol(event.target.value);
      }
    }
  };

  const addConstraintWithInput = (constraintType) => {
    if (constraintType === "CHECK" && checkCondition) {
      setConstraints([
        ...constraints.filter((item) => item !== "CHECK"),
        `CHECK (${checkCondition})`,
      ]);
      setCheckCondition("");
    } else if (
      constraintType === "FOREIGN KEY" &&
      refTableName &&
      refTableCol
    ) {
      setConstraints([
        ...constraints.filter((item) => item !== "FOREIGN KEY"),
        `FOREIGN KEY REFERENCES ${refTableName}(${refTableCol})`,
      ]);
      setRefTableName("");
      setRefTableCol("");
    }
  };

  const addColumn = () => {
    if (columnName && dataType) {
      const columnDataType =
        dataType === "VARCHAR" || dataType === "CHAR"
          ? `${dataType}(${charLength})`
          : dataType;
      setColumns([
        ...columns,
        {
          column_name: columnName,
          data_type: columnDataType,
          constraints: [...constraints],
        },
      ]);
      setColumnName("");
      setDataType("");
      setCharLength("");
      setConstraints([]);
    }
  };

  const removeColumn = (index) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
  };

  const handleSubmit = () => {
    if (tableName && columns.length > 0) {
      const output = create(object, tableName, columns);
      setOutput(output);
    }
  };

  return (
    <div>
      <h1>Create Table</h1>
      <div>
        <label htmlFor="table_name">Table Name:</label>
        <input
          type="text"
          placeholder="Table Name"
          id="table_name"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
        />
      </div>
      <div>
        <h2>Columns</h2>
        {columns.map((column, index) => (
          <div key={index}>
            <span>
              {column.column_name} {column.data_type}{" "}
              {column.constraints.join(" ")}
            </span>
            <button type="button" onClick={() => removeColumn(index)}>
              Cancel
            </button>
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="column_name">Column Name:</label>
        <input
          type="text"
          placeholder="Column Name"
          id="column_name"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
        />
        <select value={dataType} onChange={(e) => setDataType(e.target.value)}>
          <option value="">Data Type</option>
          <option value="INT">INT</option>
          <option value="VARCHAR">VARCHAR</option>
          <option value="CHAR">CHAR</option>
          <option value="BOOLEAN">BOOLEAN</option>
          {/* Add more data types as needed */}
        </select>
        {(dataType === "VARCHAR" || dataType === "CHAR") && (
          <input
            type="number"
            placeholder="Length"
            value={charLength}
            onChange={(e) => setCharLength(e.target.value)}
          />
        )}
        <div>
          {availableConstraints.map((constraint, index) => (
            <label key={index}>
              <input
                type="checkbox"
                value={constraint}
                checked={constraints.some((c) => c.startsWith(constraint))}
                onChange={handleCheckboxChange}
              />
              {constraint}
            </label>
          ))}
        </div>
        {constraints.includes("CHECK") && (
          <div>
            <input
              type="text"
              placeholder="Condition"
              value={checkCondition}
              onChange={(e) => handleConstraintInputChange("CHECK", e)}
            />
            <button
              type="button"
              onClick={() => addConstraintWithInput("CHECK")}
            >
              Add CHECK
            </button>
          </div>
        )}
        {constraints.includes("FOREIGN KEY") && (
          <div>
            <input
              type="text"
              name="refTableName"
              placeholder="Reference Table Name"
              value={refTableName}
              onChange={(e) => handleConstraintInputChange("FOREIGN KEY", e)}
            />
            <input
              type="text"
              name="refTableCol"
              placeholder="Reference Table Column"
              value={refTableCol}
              onChange={(e) => handleConstraintInputChange("FOREIGN KEY", e)}
            />
            <button
              type="button"
              onClick={() => addConstraintWithInput("FOREIGN KEY")}
            >
              Add FOREIGN KEY
            </button>
          </div>
        )}
        <button type="button" onClick={addColumn}>
          Add
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

export default CreateTable;
