import 'server-only';

import { NextRequest } from "next/server";
import { getSvg } from "@/services/image";
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
    view: string
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
        view: searchParams.get("view") || "",
    }
    const {
        id, username, bg_color,
        w, h, o,
        format,
        view
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

    if (view && view === 'preview') {
        // 提供渐进式 JPEG 预览, 并降低质量
        const jpegBuffer = await sharp(Buffer.from(result))
            .jpeg({ progressive: true, quality: 75 })
            .toBuffer();
        return new Response(jpegBuffer, {
            status: 200,
            headers: {
                'Content-Type': `image/jpeg`,
            }
        });
    }

    return new Response(result, {
        status: 200,
        headers: {
            'Content-Type': 'image/svg+xml'
        }
    });
}
