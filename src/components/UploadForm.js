import { useState } from 'react';
import styles from '../styles/App.module.css';

function UploadForm() {
    const [data, setData] = useState([]);

    const downloadData = (e) => {
        e.preventDefault();

        var dataBlob = new Blob([JSON.stringify(data)], {type: 'application/json'});
        window.location.href = window.URL.createObjectURL(dataBlob);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        let submitter = e.target.name;
        console.log(e.target.name);

        const fileInput = document.getElementById('jsonFile');
        const file = fileInput.files[0];
        
        const reader = new FileReader();

        reader.onload = (e) => {
            console.log(JSON.parse(e.target?.result));
            fetch(`/api/process?mode=${submitter}`, {
                method: "POST",
                body: JSON.stringify({ 
                    mode: submitter,
                    data: JSON.parse(e.target?.result)
                }),
            }).then(response => response.json())
                .then(resData => {
                    console.log(resData);
                    setData(resData);
                })
                .catch(error => console.error(error));
        };

        reader.readAsText(file);
        //const response = await fetch('/api/process', {
        //    method: 'POST',
        //    body: formData,
        //});
    };

    return (
        <form className={styles.form}>
            <label htmlFor="jsonFile">Upload a .json file... </label>
            <input type="file" id="jsonFile" name="jsonFile" accept=".json, text" />
            <br />
            <button name="getCompletionCounts" type="submit" onClick={onSubmit}>Get Completion Counts</button>
            <button style={{marginLeft: '2px'}} onClick={downloadData}>Download</button>
        </form>
    );
}

export default UploadForm;