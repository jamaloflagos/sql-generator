import { useContext, useState } from "react";
import { create } from "../functions";
import { OutputContext } from "../App";
const CreateDatabase = ({ object }) => {
  const [databaseName, setDatabaseName] = useState("");
  const { setOutput } = useContext(OutputContext);
  const [databaseOptions, setDatabaseOptions] = useState({
    owner: "",
    template: "",
    encoding: "",
    lcc_collate: "",
    lcc_ctype: "",
    tablespace: "",
    conn_limit: "",
  });

  const handleDatabseOptionsChange = (e) => {
    const { name, value } = e.target;
    setDatabaseOptions((prevOptions) => {
      return { ...prevOptions, [name]: value };
    });
  };

  const handleSubmit = () => {
    if (databaseName) {
      const output = create(object, databaseName, databaseOptions);
      setOutput(output);
    }
  };

  return (
    <div>
      <label htmlFor="db-name">Database Name:</label>
      <input
        type="text"
        id="db-name"
        placeholder="Database Name"
        value={databaseName}
        onChange={(e) => setDatabaseName(e.target.value)}
      />
      <label htmlFor="db-owner">Owner:</label>
      <input
        type="text"
        placeholder="Owner"
        id="db-owner"
        value={databaseOptions.owner}
        name="owner"
        onChange={handleDatabseOptionsChange}
      />
      <label htmlFor="db-template">Template:</label>
      <input
        type="text"
        placeholder="Template"
        id="db-template"
        value={databaseOptions.template}
        name="template"
        onChange={handleDatabseOptionsChange}
      />
      <label htmlFor="db-encoding">Encoding:</label>
      <input
        type="text"
        placeholder="Encoding"
        id="db-encoding"
        value={databaseOptions.encoding}
        name="encoding"
        onChange={handleDatabseOptionsChange}
      />
      <label htmlFor="lcc_collate">LCC Collate:</label>
      <input
        type="text"
        placeholder="LCC Collate"
        id="lcc_collate"
        value={databaseOptions.lcc_collate}
        name="lcc_collate"
        onChange={handleDatabseOptionsChange}
      />
      <label htmlFor="lcc_ctype">LCC Ctype:</label>
      <input
        type="text"
        placeholder="LCC Ctype"
        id="lcc_ctype"
        value={databaseOptions.lcc_ctype}
        name="lcc_ctype"
        onChange={handleDatabseOptionsChange}
      />
      <label htmlFor="tablespace">Tablespace:</label>
      <input
        type="text"
        placeholder="tablespace"
        id="tablespace"
        value={databaseOptions.tablespace}
        name="tablespace"
        onChange={handleDatabseOptionsChange}
      />
      <label htmlFor="conn_limit">Connection Limit:</label>
      <input
        type="text"
        placeholder="Connection Limit"
        id="conn_limit"
        value={databaseOptions.conn_limit}
        name="conn_limit"
        onChange={handleDatabseOptionsChange}
      />
      <div>
        <button type="button" onClick={handleSubmit}>
          Generate SQL
        </button>
      </div>
    </div>
  );
};
export default CreateDatabase;