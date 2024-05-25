import 'server-only';

import { NextRequest } from "next/server";
import { getSvg } from "@/app/api/image-service";
import seedrandom from 'seedrandom';

const defaultSize = 200;

type Query = {
    id: string
    username: string
    bg_color: string
    w: string
    h: string
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
    }
    const { id, username, bg_color, w, h } = query
    const seed = (id || username || `${Math.random()}`) as string
    const rng = seedrandom(seed);
    const width = w ? parseInt(w as string) : (h ? parseInt(h as string) : defaultSize);
    const height = h ? parseInt(h as string) : (w ? parseInt(w as string) : defaultSize);
    const result = await getSvg({ rng, bgColor: bg_color, width, height });
    return new Response(result, {
        status: 200,
        headers: {
            'Content-Type': 'image/svg+xml'
        }
    });
}
