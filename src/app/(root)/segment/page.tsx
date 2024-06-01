"use client";

import React, { useEffect, useRef } from "react";
import { pipeline, env } from '@xenova/transformers';
import { useAssetData } from '@/hooks/useAssetDb'
import { findBorders } from "@/lib/imageUtils";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";

env.allowLocalModels = false;

// 1. 上传图片
// 2. 左右布局
// 3. 下载

function getCenter(data: number[], width: number, height: number) {
    let xMin = 999999;
    let yMin = 999999;
    let xMax = 0;
    let yMax = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const currentLeft = data[y * width + x];
            if (currentLeft !== 0) {
                xMin = Math.min(xMin, x);
                xMax = Math.max(xMax, x);
                yMin = Math.min(yMin, y);
                yMax = Math.max(yMax, y);
            }
        }
    }
    return {
        x: xMin + (xMax - xMin) / 2,
        y: yMin + (yMax - yMin) / 2,
        width: xMax - xMin,
        height: yMax - yMin,
    }
}

export default function Page() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { mediaData, saveAsset } = useAssetData()

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
        saveAsset(nanoid(), map);
    }

    useEffect(() => {
        if (mediaData) {
            if (!canvasRef.current) {
                return
            }
            canvasRef.current.width = 1024;
            canvasRef.current.height = 1024;
            const ctx = canvasRef.current?.getContext('2d');
            ctx
            if (!ctx) {
                return
            }
            const {
                skin, background, l_eye: lEye,
                r_eye: rEye, l_lip: lLip, u_lip: uLip,
                hair,
            } = mediaData || {};
            const { data, width, height } = skin;
            const { data: dataBackground } = background;
            const { data: dataLeftEye } = lEye;
            const { data: dataRightEye } = rEye;
            const { data: dataLowLip } = lLip;
            const { data: dataUpLip } = uLip;
            const { data: dataHair } = hair;

            const result = findBorders(data, width, height)
            const backgroundResult = findBorders(dataBackground, width, height)
            ctx.beginPath()

            ctx.fillStyle = 'black'; // 设置填充颜色

            const leftCenter = getCenter(dataLeftEye, width, height);
            const rightCenter = getCenter(dataRightEye, width, height);

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {

                    if (
                        Math.pow(Math.abs(x - leftCenter.x), 2) * Math.pow(Math.abs(y - leftCenter.y), 2) <= 5
                        && Math.abs(x - leftCenter.x) < 5
                        && Math.abs(y - leftCenter.y) < 5
                    ) {
                        ctx.fillRect(x, y, 15, 15); // 使用 fillRect 方法绘制点
                    }

                    if (
                        Math.pow(Math.abs(x - rightCenter.x), 2) * Math.pow(Math.abs(y - rightCenter.y), 2) <= 5
                        && Math.abs(x - rightCenter.x) < 5
                        && Math.abs(y - rightCenter.y) < 5
                    ) {
                        ctx.fillRect(x, y, 15, 15); // 使用 fillRect 方法绘制点
                    }
                }
            }

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const current = dataHair[y * width + x];
                    if (current !== 0) {
                        ctx.fillRect(x, y, 5, 5); // 使用 fillRect 方法绘制点
                    }
                }
            }

            ctx.fillStyle = 'rgb(215,127,140)'; // 设置填充颜色

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const current = dataLowLip[y * width + x];
                    if (current !== 0) {
                        ctx.fillRect(x, y, 5, 5); // 使用 fillRect 方法绘制点
                    }

                    const currentLip = dataUpLip[y * width + x];
                    if (currentLip !== 0) {
                        ctx.fillRect(x, y, 1, 1); // 使用 fillRect 方法绘制点
                    }
                }
            }

            ctx.fillStyle = 'black'; // 设置填充颜色

            for (const point of result) {
                ctx.fillRect(point.x, point.y, 5, 5); // 使用 fillRect 方法绘制点
            }

            for (const point of backgroundResult) {
                ctx.fillRect(point.x, point.y, 5, 5); // 使用 fillRect 方法绘制点
            }
        }

    }, [mediaData])

    return (
        <div className='mt-5'>
            <Button onClick={onStart}>开始</Button>
            <canvas width={512} height={512} ref={canvasRef} className={'w-[512px] h-[512px]'}></canvas>
        </div>
    );
}