"use client";

import React from "react";
import { pipeline, env } from '@xenova/transformers';
import { Button } from "@/components/ui/button";
env.allowLocalModels = false;

export default function Page() {
    const onStart = async () => {
        const segmenter = await pipeline('image-segmentation', 'Xenova/face-parsing');
        console.log('start');
        const output = await segmenter('/canvas.png');
        console.log('output end', output);
    }
    return (
        <div className='mt-5'>
            <Button onClick={onStart}>开始</Button>
        </div>
    );
}