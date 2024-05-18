// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSvg } from "./image-service";
import seedrandom from 'seedrandom';

// type Data = {
//     name: any;
// };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    const { id, username } = req.query;
    const seed = (id || username || `${Math.random()}`) as string
    const rng = seedrandom(seed);
    const result = await getSvg(rng);
    res.status(200).setHeader('Content-Type', 'image/svg+xml').send(result);
}
