const analyzer = require('../../src/lib/analyzer');

var trainingJson, testJson;

// initialize
beforeAll(() => {
    trainingJson = analyzer.loadJson();

    const testDataPath = '../../__tests__/lib/analyzer.json';
    testJson = analyzer.loadJson(testDataPath);
});

describe('File loading', () => {
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
});

describe('Fiscal Year function', () => {
    let dateMap = [
        ["1/1/2005", "2005"],
        ["5/9/2005", "2005"],
        ["5/29/2005", "2005"],
        ["6/30/2005", "2005"],
        ["7/1/2005", "2006"],
        ["1/30/2007", "2007"],
        ["9/2/2018", "2019"],
        ["12/1/2020", "2021"],
        ["12/22/2020", "2021"]
    ]
    test.each(dateMap)('%s should be in FY %s', (timestamp, fiscalYear) => {
        let calcFiscalYear = analyzer.getFiscalYear(timestamp);
        expect(calcFiscalYear).toBe(fiscalYear);
    });
});

describe('Completion count', () => {
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
});