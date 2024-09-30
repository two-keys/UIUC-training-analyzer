const analyzer = require('../../src/lib/analyzer');

var trainingJson, testJson;

// initialize
beforeAll(() => {
    trainingJson = analyzer.loadJson();

    const testDataPath = '../../__tests__/lib/analyzer.json';
    testJson = analyzer.loadJson(testDataPath);
});

test('Can read training json file', () => {
    // should be Jaelyn
    let firstUser = trainingJson[0];

    expect(firstUser.name).toBe('Jaelyn Quinn');
});

test('Can read test data json file', () => {
    // should be Antony Sanchez
    let firstUser = testJson[0];

    expect(firstUser.name).toBe('Antony Sanchez');
});

// jest doesnt easily allow custom error messages, so we're wrapping everything in an each
let answerSheet = [
    ["Coding in Javascript", 2],
    ["Oracle Database Fundamentals", 1],
    ["Using Hazardous Chemicals in an Animal Care Facility", 1],
    ["Coding in C#", 1]
]
test.each(answerSheet)('%s should have %i completions', (name, count) => {
    let completionJson = analyzer.getCompletionCounts(testJson);

    completionJson.forEach((cBlob) => {
        if(name == cBlob.name)
            expect(cBlob.completions).toBe(count)
    });
});