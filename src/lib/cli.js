const analyzer = require('../../src/lib/analyzer');

let testJson = analyzer.loadJson('../../__tests__/lib/analyzer.json');
// analyzer.getCompletionCounts();
/**analyzer.getFYCompletions(
    analyzer.loadJson('../../__tests__/lib/analyzer.json'),
    ["Coding in Javascript"],
    "2021""
);*/

/*let FY = analyzer.getFYCompletions(testJson, 'Coding in Javascript', '2023');
console.log(FY)
*/

let calcExpirations = analyzer.getExpiredCompletions(testJson, 'Jan 1st, 2001');
console.log(calcExpirations);