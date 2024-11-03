import { OutputContext } from "../App";
import { useContext } from "react";

const Output = () => {
    // const [copyerror, setCopyError] = useState();
    const {output} = useContext(OutputContext);

    async function copyToClipboard(text) {
        try {
          await navigator.clipboard.writeText(text);
          alert('Copied');
        } catch (err) {
          alert('Failed to copy');
          console.error('Failed to copy: ', err);
        }
    }
    const formattedOutput = output.split('\n');
    
    return (
        <div>
            {output && <button onClick={() => copyToClipboard(output)}>Copy</button>}
            {output && output.includes('\n') ? ( 
                formattedOutput.map((line, index) => (
                    <div key={index}>
                        <span>{line}</span> 
                    </div>
                )) 
            ) : ( 
                <h1>{output}</h1>
            )} 
        </div>
    )
}
export default Output