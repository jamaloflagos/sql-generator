import { OutputContext } from "../App";
import { useContext, useState } from "react";

const Output = () => {
    const {output} = useContext(OutputContext);
    const [copySuccess, setCopySuccess] = useState();

    async function copyToClipboard(text) {
        try {
          await navigator.clipboard.writeText(text);
          setCopySuccess('Copied succesfully!');
        } catch (err) {
          alert('Failed to copy');
          console.error('Failed to copy: ', err);
        }
    }
    const formattedOutput = output.split('\n');
    
    return (
        <div className={output ? 'output_div' : ''}>
            {output && <button onClick={() => copyToClipboard(output)} className='copy_btn'>Copy</button>}
            {copySuccess && <p className="copy_success">{copySuccess}</p>}
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