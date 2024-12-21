import CreateDatabase from "./CreateDatabase";
import CreateTable from "./CreateTable";
import CreateIndex from "./CreateIndex";
import CreateView from "./CreateView";
import Select from "./Select";
import Insert from "./Insert";

const Input = ({ operation, object }) => {
  switch (operation) {
    case "CREATE":
      return (
        <div>
          {object.toUpperCase() === "TABLE" && <CreateTable object={object} />}

          {object.toUpperCase() === "DATABASE" && (
            <CreateDatabase object={object} />
          )}

          {object.toUpperCase() === "INDEX" && <CreateIndex object={object} />}

          {object.toUpperCase() === "VIEW" && <CreateView object={object} />}
        </div>
      );
    case "ALTER":
      return <h1>{operation}</h1>;
    case "TRUNCATE":
      return <h1>{operation}</h1>;
    case "DELETE":
      return <h1>{operation}</h1>;
    case "INSERT":
      return <Insert />;
    case "SELECT":
      return <Select />;
    default:
  }
};
export default Input;
