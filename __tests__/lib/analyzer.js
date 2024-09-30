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