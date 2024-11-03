import CreateDatabase from "./CreateDatabase";
import CreateTable from "./CreateTable";
import CreateIndex from "./CreateIndex";
import CreateView from "./CreateView";
import Select from "./Select";
import Insert from "./Insert";

const Input = ({ op, object }) => {
  switch (op) {
    case "CREATE":
      return (
        <>
          <h1>{op}</h1>

          {object.toUpperCase() === "TABLE" && <CreateTable object={object} />}

          {object.toUpperCase() === "DATABASE" && (
            <CreateDatabase object={object} />
          )}

          {object.toUpperCase() === "INDEX" && <CreateIndex object={object} />}

          {object.toUpperCase() === "VIEW" && <CreateView object={object} />}
        </>
      );
    case "ALTER":
      return <h1>{op}</h1>;
    case "TRUNCATE":
      return <h1>{op}</h1>;
    case "DELETE":
      return <h1>{op}</h1>;
    case "INSERT":
      return <Insert />;
    case "SELECT":
      return <Select />;
    default:
  }
};
export default Input;
