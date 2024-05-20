import type { NextApiRequest, NextApiResponse } from "next";
import { getSvg } from "./image-service";
import seedrandom from 'seedrandom';

const defaultSize = 200;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    const { id, username, bg_color, w, h } = req.query;
    const bgColor = bg_color as string;
    const seed = (id || username || `${Math.random()}`) as string
    const rng = seedrandom(seed);
    const width = w ? parseInt(w as string) : (h ? parseInt(h as string) : defaultSize);
    const height = h ? parseInt(h as string) : (w ? parseInt(w as string) : defaultSize);
    const result = await getSvg({ rng, bgColor, width, height });
    res.status(200).setHeader('Content-Type', 'image/svg+xml').send(result);
}
