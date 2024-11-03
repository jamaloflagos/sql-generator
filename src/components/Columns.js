import { dataTypes, constraints } from "./data";
import { useState } from "react";
const Columns = ({setColumns, object, columns}) => {
    const [selectedConstraints, setSelectedConstraints] = useState([]);
    const handleColumnChange = (index, field, value) => {
        console.log(field, value)
        if (value === 'CHAR' || value === 'VARCHAR') {
            const charLength = prompt('Input the character length');
            value = `CHAR(${charLength})`;
        }
        setColumns(prevColumns =>
          prevColumns.map((column, i) => (
            i === index ? { ...column, [field]: value } : column
          ))
        );
    };

    const addColumn = () => {
        setColumns([...columns, {column_name: '', data_type: '', constraint: ''}])
    };

    
    const removeColumn = (index) => {
        const newColumns = columns.filter((_, i) => i !== index);
        setColumns(newColumns);
    };

    const handleCheckboxChange = (event, index) => {
        let { checked, value } = event.target;
        let updatedConstraints = [...selectedConstraints];
        
        if (checked) {
            if (value === 'FOREIGN KEY') {
                const refTableName = prompt('Reference table name?');
                const refTableCol = prompt('Reference table column?');
                value = `${value} REFERENCES ${refTableName}(${refTableCol})`;
            } else if (value === 'CHECK') {
                const condition = prompt('Condition?');
                value = `CHECK (${condition})`;
            }
            updatedConstraints.push(value);
        } else {
            // Check if it's a FOREIGN KEY or CHECK constraint and remove the full value if necessary
            if (value.startsWith('FOREIGN KEY')) {
                updatedConstraints = updatedConstraints.filter(constraint => !constraint.startsWith('FOREIGN KEY'));
            } else if (value.startsWith('CHECK')) {
                updatedConstraints = updatedConstraints.filter(constraint => !constraint.startsWith('CHECK'));
            } else {
                updatedConstraints = updatedConstraints.filter(constraint => constraint !== value);
            }
        }
    
        console.log(updatedConstraints);
        setSelectedConstraints(updatedConstraints);
        handleColumnChange(index, 'constraint', updatedConstraints.join(' '));
    };
    
    
  return (
    <div>
        {object === 'TABLE' && (
            <fieldset>
                <legend>Columns</legend>
                {columns.map((column, index) => (
                    <div key={index}>
                        <input
                        type="text"
                        value={column.column_name}
                        placeholder="Column Name"
                        onChange={e => handleColumnChange(index, 'column_name', e.target.value)}
                        />
                        <select 
                            value={column.data_type}
                            onChange={e => handleColumnChange(index, 'data_type', e.target.value)}
                        >
                            <option value="">Data Type</option>
                            {dataTypes.map((dataType, index) => (
                                <option value={dataType.toUpperCase()} key={index}>{dataType}</option>
                            ))}
                        </select>
                        <div className="dropdown">
                            <button className="dropbtn">Select constraint</button>
                            <div className="dropdown-conten">
                                {constraints.map((constraint, index) => (
                                    <label key={index}>{constraint}:
                                        <input type="checkbox" value={constraint.toUpperCase()} onChange={(e) => handleCheckboxChange(e, index)} />
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button type="button" onClick={() => removeColumn(index)}>-</button>
                    </div>
                ))}
            {/* <button type="button" onClick={addColumn}>Add Column</button> */}
        </fieldset>
        )}

        {object === 'INDEX' && (
            <>
                {columns.map((col, index) => (
                    <div>
                        <input 
                            key={index}
                            type="text"
                            placeholder="Index Column Name"
                            value={col.column_name}
                            onChange={e => handleColumnChange(index, 'column_name', e.target.value)} 
                        />
                    <button onClick={() => removeColumn(index)}>-</button>
                    </div>
                ))}
            </>
        )}

        {object === 'VIEW' && (
            <>
                {columns.map((col, index) => (
                    <div>
                        <input 
                            key={index}
                            type="text"
                            placeholder="View Column Name"
                            value={col.column_name}
                            onChange={e => handleColumnChange(index, 'column_name', e.target.value)} 
                        />
                    <button onClick={() => removeColumn(index)}>-</button>
                    </div>
                ))}
            </>
        )}
        {object && <button onClick={addColumn}>Add more columns</button>}
    </div>
  )
}
export default Columns