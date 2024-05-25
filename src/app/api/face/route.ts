import 'server-only';

import { NextRequest } from "next/server";
import { getSvg } from "@/app/api/image-service";
import seedrandom from 'seedrandom';
import sharp from 'sharp';

const defaultSize = 200;

type Query = {
    id: string
    username: string
    bg_color: string
    w: string
    h: string
    o: string // opacity
    format: string
}
export async function GET(
    request: NextRequest
) {
    const searchParams = request.nextUrl.searchParams;
    const query: Query = {
        id: searchParams.get("id") || "",
        username: searchParams.get("username") || "",
        bg_color: searchParams.get("bg_color") || "",
        w: searchParams.get("w") || "",
        h: searchParams.get("h") || "",
        o: searchParams.get("o") || "1",
        format: searchParams.get("f") || "",
    }
    const {
        id, username, bg_color,
        w, h, o,
        format
    } = query
    const seed = (id || username || `${Math.random()}`) as string
    const rng = seedrandom(seed);
    const width = w ? parseInt(w) : (h ? parseInt(h) : defaultSize);
    const height = h ? parseInt(h) : (w ? parseInt(w) : defaultSize);
    const opacity = parseInt(o, 10);
    const result = await getSvg({ rng, bgColor: bg_color, width, height, opacity });

    if (format) {
        if (['png', 'webp', 'jpeg'].includes(format)) {
            // @ts-ignore
            const pngBuffer = await sharp(Buffer.from(result))
            [format as unknown as any]?.()
                .toBuffer()
            return new Response(pngBuffer, {
                status: 200,
                headers: {
                    'Content-Type': `image/${format}`,
                }
            });

        }
    }

    return new Response(result, {
        status: 200,
        headers: {
            'Content-Type': 'image/svg+xml'
        }
    });
}
