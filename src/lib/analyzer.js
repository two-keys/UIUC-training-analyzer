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
 * Strips ordinal suffixes from dates.
 * @param {string} date M/D/YYYY or MMMM DDD, YYYY
 * @returns date string 
 */
function dateStripper(date) {
    return date.replace(RegExp("(?<=\\d)(st|nd|rd|th)"), '')
}

/**
 * 
 * @param subject M/D/YYYY or MMMM DDD, YYYY
 * @param comparedTo M/D/YYYY or MMMM DDD, YYYY
 * @param {number} margin Number of days to increase subject by. 
 * @returns true if subject is after comparedTo
 */
function isAfter(subject, comparedTo, margin = 0) {
    let date1 = new Date(dateStripper(subject));
    let date2 = new Date(dateStripper(comparedTo));

    let marginInMilliseconds = margin * 24 * 60 * 60 * 1000;
    let newDate1 = new Date(date1.getTime() + marginInMilliseconds);

    let isAfterFlag = newDate1.getTime() > date2.getTime();
    console.log(`${date1.toString()} + margin ${margin}\n ${newDate1} is after ${date2.toString()}: ${isAfterFlag}`);
    if (isAfterFlag) {
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
    /**
     * Returns the index of a training, creating it if not already accounted for.
     * @param {string} name
     * @returns trainingIndex
     */
    const findOrCreateTrainingBlob = (name) => {
        // check if the training already exists in trainingBlobs
        let trainingIndex = trainingBlobs.findIndex((tBlob) => tBlob.name == name);
        if(trainingIndex == -1) {
            // create new trainingBlob
            let newLength = trainingBlobs.push({
                name: name, // training name
                users: []
            });
            trainingIndex = newLength - 1;
        }
        return trainingIndex;
    }

    /**
     * Returns the index of a user within a trainingBlob, creating it if not already accounted for.
     * @param {string} name
     * @param {number} trainingIndex index in trainingBlob.users
     * @returns trainingIndex
     */
    const findOrCreateUserBlob = (name, trainingIndex) => {
        // look for user's index in training blob
        let users = trainingBlobs[trainingIndex].users;
        let userIndex = users.findIndex(
            (ub) => {
                // console.log(`${ub.name}, ${userBlob.name}`)
                return ub.name == name;
            }
        );
        if(userIndex == -1) {
            // create new user
            let newLength = trainingBlobs[trainingIndex].users.push({
                name: name, // user name
                latestCompletionIndex: 0,
                completions: []
            });
            userIndex = newLength - 1;
        }
        return userIndex;
    }

    var trainingBlobs = [];

    // iterate over userBlobs
    inputFile.forEach((userBlob) => {
        // look at user's completions
        userBlob.completions.forEach((cBlob, cIndex) => {
            let trainingIndex = findOrCreateTrainingBlob(cBlob.name);

            let users = trainingBlobs[trainingIndex].users;
            let userIndex = findOrCreateUserBlob(userBlob.name, trainingIndex);

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
 * @param {Array} trainings The JSON file to analyze.
 * @param {String} fiscalYear The JSON file to analyze.
 */
function getFYCompletions(inputFile, trainings, fiscalYear) {
    var trainingBlobs = getTrainingBlobs(inputFile);
    let filteredBlobs = [];

    trainingBlobs.forEach((tBlob) => {
        if(trainings.includes(tBlob.name)) {
            // find people with FY completions
            let filteredPeople = tBlob.users.filter((uBlob) => {
                let hasFYCompletion = uBlob.completions.findIndex((cBlob) =>
                    cBlob.fiscalYear == fiscalYear
                );
                return hasFYCompletion != -1;
            }).map((uBlob) => {
                // we only need their names
                return uBlob.name;
            });
            // console.log(filteredPeople.length);

            let tempFilterBlob = {
                name: tBlob.name,
                people: filteredPeople
            }
            filteredBlobs.push(tempFilterBlob);
        }
    });

    // console.log(filteredBlobs);
    return filteredBlobs;
}

/**
 * Crates a list of people and only their expired trainings.
 * @param inputFile The JSON file to analyze.
 * @param {string} targetDate Oct 1st, 2023
 * @param {Array<string>} users An optional array of users for filtering/testing.
 */
function getExpiredCompletions(inputFile, targetDate, users = null) {
    if(Array.isArray(users) == true)
        console.log(`${users.toString()} : ${targetDate}`);
    var userBlobs = inputFile;

    const expiryFilter = (cBlob, margin = 30) => {
        if(typeof cBlob.expires !== 'undefined' && cBlob.expires != null) {
            // get only people with expired/expiring completions
            return isAfter(targetDate, cBlob.expires, margin) // 30 day margin
        }
        return false;
    }
    const strictExpiryFilter = (cBlob) => expiryFilter(cBlob, 0);

    let filteredBlobs = userBlobs.filter((uBlob) => {
        let isInFilter = (Array.isArray(users) == false) || users.includes(uBlob.name);
        // get only people with expired/expiring completions
        let hasExpiredCompletion = uBlob.completions.findIndex((cBlob) => expiryFilter(cBlob));
        return isInFilter && (hasExpiredCompletion != -1);
    }).map((uBlob) => {
        return {
            name: uBlob.name, // user name
            completions: uBlob.completions.filter((cBlob) => expiryFilter(cBlob)).map((cBlob) => {
                return {
                    name: cBlob.name,
                    status: (strictExpiryFilter(cBlob)) ? 'expired' : 'expires soon'
                }
            })
        }
    });

    return filteredBlobs;
}

module.exports = {
    loadJson, getFiscalYear, dateStripper, isAfter, getCompletionCounts, getFYCompletions, getExpiredCompletions
};