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

    let fiscalYearMap = [
        ["2024", [ // filter
            "Coding in C#", "Using Hazardous Chemicals in an Animal Care Facility"
        ]],
        ["2022", [
            "Oracle Database Fundamentals"
        ]],
    ]

    test.each(dateMap)('%s should be in FY %s', (timestamp, fiscalYear) => {
        let calcFiscalYear = analyzer.getFiscalYear(timestamp);
        expect(calcFiscalYear).toBe(fiscalYear);
    });

    test.each(fiscalYearMap)('FY %s should contain our filtered entries', (fiscalYear, trainings) => {
        const leftIncludesRight = (leftArr, rightArr) => {
            let leftHasRight = true;
            rightArr.forEach((value) => {
                if(!leftArr.includes(value))
                    leftHasRight = false;
            });
            return leftHasRight;
        }

        let fiscalYearComps = analyzer.getFYCompletions(
            testJson, trainings, fiscalYear
        ).map(
            (tBlob) => tBlob.name
        );

        // calculated vales should include our WHOLE answer key
        expect(leftIncludesRight(fiscalYearComps, trainings)).toBe(true);
        // our answer key should include the calculated values
        expect(leftIncludesRight(trainings, fiscalYearComps)).toBe(true);
    });

    test('Coding in Javascript should only have two names', () => {
        let fiscalYearComps = analyzer.getFYCompletions(
            testJson, ["Coding in Javascript"], '2023'
        );

        expect(fiscalYearComps[0].people.length).toBe(2);
    })
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