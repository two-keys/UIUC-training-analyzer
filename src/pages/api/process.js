import { NextResponse } from "next/server";
import stream from 'stream';
import { promisify } from 'util';

const pipeline = promisify(stream.pipeline);

const serverResp = async (req, res) => {
    // console.log(req);

    let reqBody = req.body;
    let reqJson = JSON.parse(reqBody);

    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=j.json');
    await pipeline(JSON.stringify(reqJson), res);
};

export default serverResp;