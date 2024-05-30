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
        const map: any = {}
        Object.keys(output).forEach((key: any) => {
            const item = output[key];
            const { label, mask } = item;
            map[label] = mask;
        });
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) {
            return
        }
        // 0 背景（不着急，当成透明）
        // 1. 轮廓， skin
        // 头发
        // 嘴巴
        // 眼睛
        // 鼻子

    }
    return (
        <div className='mt-5'>
            <Button onClick={onStart}>开始</Button>
            <canvas width={512} height={512} ref={canvasRef}></canvas>
        </div>
    );
}