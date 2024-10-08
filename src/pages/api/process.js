import stream from 'stream';
import { promisify } from 'util';

import { getCompletionCounts, getFYCompletions, getExpiredCompletions } from '../../lib/analyzer';
import { useRouter } from 'next/router';

const pipeline = promisify(stream.pipeline);

const serverResp = async (req, res) => {
    // console.log(req);

    let reqBody = JSON.parse(req.body);
    // console.log(req.body);
    
    let mode = reqBody['mode'];
    let data = reqBody['data'];
    let trainings = reqBody['trainings'];
    let fiscalYear = reqBody['fiscalYear'];
    let targetDate = reqBody['targetDate'];

    let resJSON;
    switch (mode) {
        case 'getCompletionCounts':
            resJSON = getCompletionCounts(data);
            break;
        case 'getFYCompletions':
            resJSON = getFYCompletions(data, trainings, fiscalYear);
            break;
        case 'getExpiredCompletions':
            resJSON = getExpiredCompletions(data, targetDate);
            break;
    
        default:
            console.error('Something has gone wrong...');
            break;
    }

    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=j.json');
    await pipeline(JSON.stringify(resJSON), res);
};

export default serverResp;