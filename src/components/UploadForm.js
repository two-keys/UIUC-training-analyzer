import { useState } from 'react';
import styles from '../styles/App.module.css';
import Divider from './Divider';

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
        // console.log(e.target.name);

        const fileInput = document.getElementById('jsonFile');
        const file = fileInput.files[0];

        const trainings = (
            document.getElementById('trainings').value
        ).replace('"', '').split('", "');
        console.log(trainings);

        const fiscalYear = document.getElementById('fiscalYear').value;
        
        const reader = new FileReader();

        reader.onload = (e) => {
            console.log(JSON.parse(e.target?.result));
            fetch(`/api/process?mode=${submitter}`, {
                method: "POST",
                body: JSON.stringify({ 
                    mode: submitter,
                    data: JSON.parse(e.target?.result),
                    fiscalYear: fiscalYear,
                    trainings: trainings,
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
            <Divider />
            <button name="getCompletionCounts" type="submit" onClick={onSubmit}>Get Completion Counts</button>
            <Divider />
            <label htmlFor="trainings">Trainings </label>
            <input type="text" id="trainings" />
            <label htmlFor="fiscalYear">Fiscal Year </label>
            <input type="text" id="fiscalYear" />
            <button name="getFYCompletions" type="submit" onClick={onSubmit}>Get Fiscal Year Completions</button>
            <Divider />
            <button style={{marginLeft: '2px'}} onClick={downloadData}>Download</button>
        </form>
    );
}

export default UploadForm;