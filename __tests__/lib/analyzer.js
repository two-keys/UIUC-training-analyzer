const analyzer = require('../../src/lib/analyzer');

const testDataPath = '../../__tests__/lib/analyzer.json';

test('Can read training json file', () => {
    var trainingJson = analyzer.loadJson();

    // should be Jaelyn
    let firstUser = trainingJson[0];

    expect(firstUser.name).toBe('Jaelyn Quinn');
});

test('Can read test data json file', () => {
    var trainingJson = analyzer.loadJson(testDataPath);

    // should be Antony Sanchez
    let firstUser = trainingJson[0];

    expect(firstUser.name).toBe('Antony Sanchez');
});