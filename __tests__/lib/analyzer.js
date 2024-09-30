const analyzer = require('../../src/lib/analyzer');

test('Can read training json file', () => {
    var trainingJson = analyzer.loadJson();

    // should be Jaelyn
    let firstUser = trainingJson[0];

    expect(firstUser.name).toBe('Jaelyn Quinn');
});