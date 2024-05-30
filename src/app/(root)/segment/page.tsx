"use client";

import React, { useRef } from "react";
import { pipeline, env } from '@xenova/transformers';
import { Button } from "@/components/ui/button";
env.allowLocalModels = false;

export default function Page() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const onStart = async () => {
        const segmenter = await pipeline('image-segmentation', 'Xenova/face-parsing');
        console.log('start');
        const output = await segmenter('/a.png');
        console.log('output end', output);
        const map = {}
        Object.keys(output).forEach((key: any) => {
            const item = output[key];
            const { } = item;
            // map[item]
        });
        // for (const m of output) {
        //     m.mask.save(`${m.label}.png`);
        // }
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) {
            return
        }
        // ctx.s
    }
    return (
        <div className='mt-5'>
            <Button onClick={onStart}>开始</Button>
            <canvas width={512} height={512} ref={canvasRef}></canvas>
        </div>
    );
}