import 'server-only';

import { NextRequest } from "next/server";
import { dialogue } from '@/services/zhipu';

const defaultSize = 200;


export async function POST(
    request: NextRequest
) {
    const userContent = await request.json();
    const result = (await dialogue(userContent.text || '学习')) || '';
    return new Response(result, {
        status: 200,
        headers: {
            'Content-Type': 'image/svg+xml'
        }
    });
}
