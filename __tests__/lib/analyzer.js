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

describe('date functions', () => {
    let stripperDates = [
        ['Jan 1st, 2022', '1/1/2022'],
        ['Feb 2nd, 2019', '2/2/2019'],
        ['Mar 3rd, 2029', '3/3/2029'],
        ['Sep 9th, 2003', '9/9/2003'],
        ['Oct 1st, 2023', '10/1/2023']
    ];
    let dateMap = [
        ['09/20/2024', '09/20/2024', 1],
        ['09/20/2024', '09/19/2024', 0],
        ['09/20/2024', '01/01/1000', 0],
        ['09/19/2024','09/20/2024', 2],
        ['08/19/2024', '09/20/2024', 33]
    ];
    let wrongDateMap = [
        ['09/20/2024', '09/20/2024', 0],
        ['01/01/1000', '09/20/2024', 0],
        ['09/19/2024','09/20/2024', 1],
        ['08/19/2024', '09/20/2024', 10]
    ];

    test.each(stripperDates)('%s is the same as %s', (ordinal, realDate) => {
        let ordinalDateObj = new Date(analyzer.dateStripper(ordinal));
        let realDateObj = new Date(realDate);

        expect(ordinalDateObj.getTime()).toBe(realDateObj.getTime());
    });

    test.each(dateMap)('%s is after %s with a %i day margin', (subject, comparedTo, margin) => {
        expect(analyzer.isAfter(subject, comparedTo, margin)).toBe(true);
    });

    test.each(wrongDateMap)('%s is NOT after %s with a %i day margin', (subject, comparedTo, margin) => {
        expect(analyzer.isAfter(subject, comparedTo, margin)).toBe(false);
    });
});

describe('Completion count', () => {
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

describe('Expiration function', () => {
    let answerKey = {
        '01/01/2001': { 
            'Antony Sanchez': { count: 0 },
            'John Doe': { count: 2 },
            'Mary Jane': { count: 1 }
        }
    }
    let answerKeyArray = Object.keys(answerKey).map((aKey) => {
        return [
            aKey,
            Object.keys(answerKey[aKey]).map((pKey) => {
                return [pKey, answerKey[aKey][pKey].count]
            })
        ]
    });

    describe.each(answerKeyArray)('User expirations for %s', (targetDate, peopleKeyArray) => {
        test.each(peopleKeyArray)('Expirations for %s should be %i', (personName, count) => {
            let expComps = analyzer.getExpiredCompletions(testJson, targetDate, [personName]);

            if (count == 0)
                expect(expComps.length).toBe(0);
            else
                expect(expComps[0].completions.length).toBe(count);
        })
    });
});