/**
 * Loads in a json file.
 */
function loadJson() {
    var trainings = require('../../public/data/trainings (correct).json');

    return trainings;
}

/**
 * Counts the latest completion for all trainings.
 * @param inputFile The JSON file to analyze.
 */
function getCompletionCounts(inputFile) {
    // TODO
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
    loadJson
};