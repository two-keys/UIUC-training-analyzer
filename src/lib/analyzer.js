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
 * 
 * @param subject 
 * @param comparedTo 
 * @returns true if subject is after comparedTo
 */
function isAfter(subject, comparedTo) {
    let date1 = new Date(subject);
    let date2 = new Date(comparedTo);

    if (date1.getTime() > date2.getTime()) {
        return true;
    } else {
        return false;
    }
}

/**
 * Gets training blobs for further processing
 * @param inputFile The JSON file to analyze.
 */
function getTrainingBlobs(inputFile) {
    var trainingBlobs = [];

    // iterate over userBlobs
    inputFile.forEach((userBlob) => {
        // look at user's completions
        userBlob.completions.forEach((cBlob, cIndex) => {
            // check if the training already exists in trainingBlobs
            let trainingIndex = trainingBlobs.findIndex((tBlob) => tBlob.name == cBlob.name);
            if(trainingIndex == -1) {
                // create new trainingBlob
                let newLength = trainingBlobs.push({
                    name: cBlob.name, // training name
                    users: []
                });
                trainingIndex = newLength - 1;
            }

            // look for user's index in training blob
            let users = trainingBlobs[trainingIndex].users;
            let userIndex = users.findIndex(
                (ub) => {
                    // console.log(`${ub.name}, ${userBlob.name}`)
                    return ub.name == userBlob.name;
                }
            );
            if(userIndex == -1) {
                // create new user
                let newLength = trainingBlobs[trainingIndex].users.push({
                    name: userBlob.name, // user name
                    latestCompletionIndex: 0,
                    completions: []
                });
                userIndex = newLength - 1;
            }

            let userComBlob = {
                fiscalYear: getFiscalYear(cBlob.timestamp),
                timestamp: cBlob.timestamp,
                expires: cBlob.expires
            };
            users[userIndex].completions.push(userComBlob);

            // update latest index
            let oldTimestampIndex = users[userIndex].latestCompletionIndex;
            let oldTimestamp = users[userIndex].completions[oldTimestampIndex].timestamp;
            if (isAfter(cBlob.timestamp, oldTimestamp)) {
                users[userIndex].latestCompletionIndex = cIndex;
            };
        });
    });

    return trainingBlobs;
}

/**
 * Counts the latest completion for all trainings.
 * @param inputFile The JSON file to analyze.
 */
function getCompletionCounts(inputFile) {
    var trainingBlobs = getTrainingBlobs(inputFile);

    return trainingBlobs.map((tBlob) => {
        return {
            name: tBlob.name,
            completions: tBlob.users.length
        }
    });
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