import React, { useContext, useState } from "react";
import { create } from "../functions";
import { OutputContext } from "../App";

const CreateView = ({ object }) => {
  const { setOutput } = useContext(OutputContext);
  const [message, setMessage] = useState("");
  const [viewName, setViewName] = useState("");
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([]);
  const [columnInput, setColumnInput] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [joins, setJoins] = useState([]);
  const [joinInput, setJoinInput] = useState({
    type: "INNER",
    table: "",
    condition: "",
  });
  const [aggregates, setAggregates] = useState([]);
  const [aggregateInput, setAggregateInput] = useState({
    function: "SUM",
    column: "",
    alias: "",
  });
  const [selectAllColumns, setSelectAllColumns] = useState(false);
  const [clauses, setClauses] = useState({
    where_only: { status: false, condition: "" },
    and: { status: false, conditions: ["", ""] },
    or: { status: false, conditions: ["", ""] },
    between: { status: false, conditions: ["", ""] },
    group_by: {
      status: false,
      columns: [],
      having: { status: false, condition: "" },
    },
    order_by: { status: false, columns: [], orders: [] },
    limit: { status: false, amount: "" },
    offset: { status: false, amount: "" },
    fetch: { status: false, option: "NEXT", amount: "" },
  });
  const [groupByColumnInput, setGroupByColumnInput] = useState("");
  const [orderByColumnInput, setOrderByColumnInput] = useState("");
  const [orderByOrderInput, setOrderByOrderInput] = useState("ASC");
  console.log(clauses);

  const addColumn = () => {
    if (columnInput) {
      setColumns([...columns, columnInput]);
      setColumnInput("");
    } else {
      setColumns(["*"]);
    }
  };

  const removeColumn = (index) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
  };

  const handleClauseChange = (clause, value) => {
    setClauses({ ...clauses, [clause]: value });
  };

  const handleWhereClauseChange = (type) => {
    setClauses({
      ...clauses,
      where_only: { status: type === "where_only", condition: "" },
      and: { status: type === "and", conditions: ["", ""] },
      or: { status: type === "or", conditions: ["", ""] },
      between: { status: type === "between", conditions: ["", ""] },
    });
  };

  const addGroupByColumn = () => {
    if (groupByColumnInput) {
      setClauses({
        ...clauses,
        group_by: {
          ...clauses.group_by,
          columns: [...clauses.group_by.columns, groupByColumnInput],
        },
      });
      setGroupByColumnInput("");
    }
  };

  const removeGroupByColumn = (index) => {
    const newColumns = clauses.group_by.columns.filter((_, i) => i !== index);
    setClauses({
      ...clauses,
      group_by: {
        ...clauses.group_by,
        columns: newColumns,
      },
    });
  };

  const addOrderByColumn = () => {
    if (orderByColumnInput) {
      setClauses({
        ...clauses,
        order_by: {
          ...clauses.order_by,
          columns: [...clauses.order_by.columns, orderByColumnInput],
          orders: [...clauses.order_by.orders, orderByOrderInput],
        },
      });
      setOrderByColumnInput("");
      setOrderByOrderInput("ASC");
    }
  };

  const removeOrderByColumn = (index) => {
    const newColumns = clauses.order_by.columns.filter((_, i) => i !== index);
    const newOrders = clauses.order_by.orders.filter((_, i) => i !== index);
    setClauses({
      ...clauses,
      order_by: {
        ...clauses.order_by,
        columns: newColumns,
        orders: newOrders,
      },
    });
  };

  const handleGroupByChange = (event) => {
    const { name, checked } = event.target;
    setClauses({
      ...clauses,
      group_by: {
        ...clauses.group_by,
        [name]: checked,
      },
    });
  };

  const handleGroupByHavingChange = (event) => {
    const { name, value, checked } = event.target;
    setClauses({
      ...clauses,
      group_by: {
        ...clauses.group_by,
        having: {
          ...clauses.group_by.having,
          [name]: name === "status" ? checked : value,
        },
      },
    });
  };

  const handleOrderByChange = (event) => {
    const { name, checked } = event.target;
    setClauses({
      ...clauses,
      order_by: {
        ...clauses.order_by,
        [name]: checked,
      },
    });
  };

  const handleFetchChange = (event) => {
    const { name, value, checked } = event.target;
    setClauses({
      ...clauses,
      fetch: {
        ...clauses.fetch,
        [name]: name === "status" ? checked : value,
      },
    });
  };

  const handleLimitChange = (event) => {
    const { value, checked } = event.target;
    setClauses({
      ...clauses,
      limit: {
        status: checked !== undefined ? checked : clauses.limit.status,
        amount: value,
      },
    });
  };

  const handleOffsetChange = (event) => {
    const { value, checked } = event.target;
    setClauses({
      ...clauses,
      offset: {
        status: checked !== undefined ? checked : clauses.offset.status,
        amount: value,
      },
    });
  };

  const addJoin = () => {
    if (joinInput.table && joinInput.condition) {
      setJoins([...joins, joinInput]);
      setJoinInput({ type: "INNER", table: "", alias: "", condition: "" });
    }
  };

  const removeJoin = (index) => {
    const newJoins = joins.filter((_, i) => i !== index);
    setJoins(newJoins);
  };

  const addAggregate = () => {
    if (aggregateInput.function) {
      setAggregates([
        ...aggregates,
        {
          ...aggregateInput,
          column: selectAllColumns ? "*" : aggregateInput.column,
        },
      ]);
      setAggregateInput({ function: "SUM", column: "", alias: "" });
      setSelectAllColumns(false); // Reset checkbox after adding
    }
  };

  const removeAggregate = (index) => {
    const newAggregates = aggregates.filter((_, i) => i !== index);
    setAggregates(newAggregates);
  };

  const handleSubmit = () => {
    // const columnsToSelect = selectAll ? "all" : columns;
    const activeClauses = Object.fromEntries(
      Object.entries(clauses).filter(([_, value]) => value.status)
    );
    if (!tableName || !viewName || !columns.length > 0) {
      setMessage("You did not fill view name, table name or columns");
      return;
    }

    setMessage("");
    const output = create(
      object,
      viewName,
      tableName,
      columns,
      activeClauses,
      joins,
      aggregates
    );
    setOutput(output);
  };

  return (
    <div>
      <h1>Create View</h1>
      <div>
        <label>
          View Name:
          <input
            type="text"
            value={viewName}
            placeholder="View Name"
            onChange={(e) => setViewName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>Table Name:</label>
        <input
          type="text"
          placeholder="View table name"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
        />
      </div>
      <div>
        <div>
          <span>View table columns</span> <br />
          <label>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={(e) => setSelectAll(e.target.checked)}
            />
            Select All Columns
          </label>
        </div>
        {!selectAll && (
          <div>
            <label>Column:</label>
            <input
              type="text"
              placeholder="Column Name"
              value={columnInput}
              onChange={(e) => setColumnInput(e.target.value)}
            />
          </div>
        )}
        <button onClick={addColumn}>Add Column</button>
        {/* <button onClick={() => setSelectAll(!selectAll)}>
          Select All Columns
        </button> */}
        <ul>
          {columns.map((column, index) => (
            <li key={index}>
              {column}{" "}
              <button onClick={() => removeColumn(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Joins</h3>
        <div>
          <label>Type:</label>
          <select
            value={joinInput.type}
            onChange={(e) =>
              setJoinInput({ ...joinInput, type: e.target.value })
            }
          >
            <option value="INNER">INNER</option>
            <option value="LEFT">LEFT</option>
            <option value="RIGHT">RIGHT</option>
            <option value="FULL">FULL</option>
          </select>
          <label>Table:</label>
          <input
            type="text"
            value={joinInput.table}
            onChange={(e) =>
              setJoinInput({ ...joinInput, table: e.target.value })
            }
          />
          <label>Alias:</label>
          <input
            type="text"
            value={joinInput.alias}
            onChange={(e) =>
              setJoinInput({ ...joinInput, alias: e.target.value })
            }
          />
          <label>Condition:</label>
          <input
            type="text"
            value={joinInput.condition}
            onChange={(e) =>
              setJoinInput({ ...joinInput, condition: e.target.value })
            }
          />
          <button onClick={addJoin}>Add Join</button>
        </div>
        <ul>
          {joins.map((join, index) => (
            <li key={index}>
              {join.type} JOIN {join.table} {join.alias && "AS"} {join.alias} ON{" "}
              {join.condition}
              <button onClick={() => removeJoin(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Aggregate Functions</h3>
        <div>
          <label>Function:</label>
          <select
            value={aggregateInput.function}
            onChange={(e) =>
              setAggregateInput({ ...aggregateInput, function: e.target.value })
            }
          >
            <option value="SUM">SUM</option>
            <option value="AVG">AVG</option>
            <option value="MIN">MIN</option>
            <option value="MAX">MAX</option>
            <option value="COUNT">COUNT</option>
          </select>
          <div>
            <label>
              <input
                type="checkbox"
                checked={selectAllColumns}
                onChange={(e) => setSelectAllColumns(e.target.checked)}
              />
              Select All Columns
            </label>
          </div>
          {!selectAllColumns && (
            <div>
              <label>Column:</label>
              <input
                type="text"
                value={aggregateInput.column}
                onChange={(e) =>
                  setAggregateInput({
                    ...aggregateInput,
                    column: e.target.value,
                  })
                }
              />
            </div>
          )}
          <label>Alias:</label>
          <input
            type="text"
            value={aggregateInput.alias}
            onChange={(e) =>
              setAggregateInput({ ...aggregateInput, alias: e.target.value })
            }
          />
          <button onClick={addAggregate}>Add Aggregate</button>
        </div>
        <ul>
          {aggregates.map((aggregate, index) => (
            <li key={index}>
              {aggregate.function}({aggregate.column || "*"}){" "}
              {aggregate.alias && "AS"} {aggregate.alias}
              <button onClick={() => removeAggregate(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Clauses</h2>
        <div>
          <label>
            <input
              type="radio"
              name="whereClause"
              checked={clauses.where_only.status}
              onChange={() => handleWhereClauseChange("where_only")}
            />
            Where Only:
            <input
              type="text"
              value={clauses.where_only.condition}
              onChange={(e) =>
                handleClauseChange("where_only", {
                  status: true,
                  condition: e.target.value,
                })
              }
              disabled={!clauses.where_only.status}
            />
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="whereClause"
              checked={clauses.and.status}
              onChange={() => handleWhereClauseChange("and")}
            />
            And:
            <input
              type="text"
              value={clauses.and.conditions[0]}
              onChange={(e) =>
                handleClauseChange("and", {
                  status: true,
                  conditions: [e.target.value, clauses.and.conditions[1]],
                })
              }
              disabled={!clauses.and.status}
            />
            <input
              type="text"
              value={clauses.and.conditions[1]}
              onChange={(e) =>
                handleClauseChange("and", {
                  status: true,
                  conditions: [clauses.and.conditions[0], e.target.value],
                })
              }
              disabled={!clauses.and.status}
            />
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="whereClause"
              checked={clauses.or.status}
              onChange={() => handleWhereClauseChange("or")}
            />
            Or:
            <input
              type="text"
              value={clauses.or.conditions[0]}
              onChange={(e) =>
                handleClauseChange("or", {
                  status: true,
                  conditions: [e.target.value, clauses.or.conditions[1]],
                })
              }
              disabled={!clauses.or.status}
            />
            <input
              type="text"
              value={clauses.or.conditions[1]}
              onChange={(e) =>
                handleClauseChange("or", {
                  status: true,
                  conditions: [clauses.or.conditions[0], e.target.value],
                })
              }
              disabled={!clauses.or.status}
            />
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="whereClause"
              checked={clauses.between.status}
              onChange={() => handleWhereClauseChange("between")}
            />
            Between:
            <input
              type="text"
              value={clauses.between.conditions[0]}
              onChange={(e) =>
                handleClauseChange("between", {
                  status: true,
                  conditions: [e.target.value, clauses.between.conditions[1]],
                })
              }
              disabled={!clauses.between.status}
            />
            <input
              type="text"
              value={clauses.between.conditions[1]}
              onChange={(e) =>
                handleClauseChange("between", {
                  status: true,
                  conditions: [clauses.between.conditions[0], e.target.value],
                })
              }
              disabled={!clauses.between.status}
            />
          </label>
        </div>
        <div>
          <label>
            Group By:
            <input
              type="checkbox"
              name="status"
              checked={clauses.group_by.status}
              onChange={handleGroupByChange}
            />
            {clauses.group_by.status && (
              <div>
                {clauses.group_by.columns.map((column, index) => (
                  <div key={index}>
                    <span>{column}</span>
                    <button
                      type="button"
                      onClick={() => removeGroupByColumn(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  name="columns"
                  value={groupByColumnInput}
                  onChange={(e) => setGroupByColumnInput(e.target.value)}
                />
                <button type="button" onClick={addGroupByColumn}>
                  Add Group By Column
                </button>
                <label>
                  Having:
                  <input
                    type="checkbox"
                    name="status"
                    checked={clauses.group_by.having.status}
                    onChange={handleGroupByHavingChange}
                  />
                  <input
                    type="text"
                    name="condition"
                    value={clauses.group_by.having.condition}
                    onChange={handleGroupByHavingChange}
                    disabled={!clauses.group_by.having.status}
                  />
                </label>
              </div>
            )}
          </label>
        </div>
        <div>
          <label>
            Order By:
            <input
              type="checkbox"
              name="status"
              checked={clauses.order_by.status}
              onChange={handleOrderByChange}
            />
            {clauses.order_by.status && (
              <div>
                {clauses.order_by.columns.map((column, index) => (
                  <div key={index}>
                    <span>
                      {column} - {clauses.order_by.orders[index]}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeOrderByColumn(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  name="column"
                  value={orderByColumnInput}
                  onChange={(e) => setOrderByColumnInput(e.target.value)}
                />
                <select
                  name="order"
                  value={orderByOrderInput}
                  onChange={(e) => setOrderByOrderInput(e.target.value)}
                >
                  <option value="ASC">ASC</option>
                  <option value="DESC">DESC</option>
                </select>
                <button type="button" onClick={addOrderByColumn}>
                  Add Order By Column
                </button>
              </div>
            )}
          </label>
        </div>
        <div>
          <label>
            Limit:
            <input
              type="checkbox"
              name="status"
              checked={clauses.limit.status}
              onChange={(e) =>
                handleLimitChange({ target: { checked: e.target.checked } })
              }
            />
            <input
              type="text"
              value={clauses.limit.amount}
              onChange={(e) =>
                handleLimitChange({ target: { value: e.target.value } })
              }
              disabled={!clauses.limit.status}
            />
          </label>
        </div>
        <div>
          <label>
            Offset:
            <input
              type="checkbox"
              name="status"
              checked={clauses.offset.status}
              onChange={(e) =>
                handleOffsetChange({ target: { checked: e.target.checked } })
              }
            />
            <input
              type="text"
              value={clauses.offset.amount}
              onChange={(e) =>
                handleOffsetChange({ target: { value: e.target.value } })
              }
              disabled={!clauses.offset.status}
            />
          </label>
        </div>
        <div>
          <label>
            Fetch:
            <input
              type="checkbox"
              name="status"
              checked={clauses.fetch.status}
              onChange={handleFetchChange}
            />
            <select
              name="option"
              value={clauses.fetch.option}
              onChange={handleFetchChange}
              disabled={!clauses.fetch.status}
            >
              <option value="NEXT">NEXT</option>
              <option value="FIRST">FIRST</option>
            </select>
            <input
              type="text"
              name="amount"
              value={clauses.fetch.amount}
              onChange={handleFetchChange}
              disabled={!clauses.fetch.status}
            />
          </label>
        </div>
      </div>
      {message && <span>{message}</span>}
      <button onClick={handleSubmit} className="generate_btn">Generate SELECT Statement</button>
    </div>
  );
};

export default CreateView;
