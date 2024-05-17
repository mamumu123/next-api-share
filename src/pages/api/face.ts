// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSvg } from "./image-service";

// type Data = {
//     name: any;
// };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    const result = await getSvg();
    res.status(200).setHeader('Content-Type', 'image/svg+xml').send(result);
}
