/**
 * Loads in a json file.
 */
function loadJson(path = '../../public/data/trainings (correct).json') {
    var trainings = require(path);

    return trainings;
}

/**
 * 
 * @param timestamp M/D/YYYY
 * @returns YYYY, where year n is betwen 7/1/n-1 - 6/30/n
 */
function getFiscalYear(timestamp) {
    let pieces = timestamp.split("/");
    let month = parseInt(pieces[0]); // 9/_/____
    let day = parseInt(pieces[1]); // _/12/____
    let year = parseInt(pieces[2]); // _/_/2021
    var fiscalYear = year;

    // months cannot be greater than 12
    if(month >= 7) {
        fiscalYear = year + 1;
    }
    return fiscalYear.toString();
}

/**
 * Counts the latest completion for all trainings.
 * @param inputFile The JSON file to analyze.
 */
function getCompletionCounts(inputFile) {
    var trainingBlobs = [];

    // iterate over userBlobs
    inputFile.forEach((userBlob) => {
        let userTrainings = [];

        // look at user's completions
        userBlob.completions.forEach((cBlob) => {
            // check that this training has not already been processed for user
            let userTrainIndex = userTrainings.findIndex((ut) => ut == cBlob.name);

            if(userTrainIndex == -1) {
                userTrainings.push(cBlob.name);

                // check if completion already exists in trainingBlobs
                let blobIndex = trainingBlobs.findIndex((tBlob) => tBlob.name == cBlob.name);

                if(blobIndex != -1) {
                    // increment by one
                    trainingBlobs[blobIndex].completions++;
                } else {
                    // create new trainingBlob
                    trainingBlobs.push({
                        name: cBlob.name,
                        completions: 1
                    });
                }
            }
        });
    });

    return trainingBlobs;
}

/**
 * Creates a list of people that completed specified training(s).
 * @param inputFile The JSON file to analyze.
 */
function getUserCompletions(inputFile, trainings, fiscalYear) {
    // TODO
}

/**
 * Crates a list of people and only their expired trainings.
 * @param inputFile The JSON file to analyze.
 */
function getExpiredCompletions(inputFile) {
    // TODO
}

module.exports = {
    loadJson, getFiscalYear, getCompletionCounts
};