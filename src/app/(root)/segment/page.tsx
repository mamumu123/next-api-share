"use client";

import React, { useEffect, useRef, useState } from "react";
import { pipeline, env } from '@xenova/transformers';
import { useAssetData } from '@/hooks/useAssetDb'
import { findBorders } from "@/lib/imageUtils";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getCenter, loaderProp } from "@/utils/image";
import { BG_TYPE } from "@/constants";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import ColorLib from 'color';

env.allowLocalModels = false;

export default function Page() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasBgRef = useRef<HTMLCanvasElement>(null);
    const canvasHairRef = useRef<HTMLCanvasElement>(null);
    const srcRef = useRef<HTMLImageElement>(null);
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

    const [bgType, setBgType] = useState(BG_TYPE.RANDOM);
    const onBgChange = (value: BG_TYPE) => {
        setBgType(value)
    }

    const [color, setColor] = useState('#000000');

    const changeColor = (event: any) => {
        setColor(event.target.value)
    }


    useEffect(() => {
        if (mediaData) {
            if (!canvasBgRef.current) {
                return
            }
            canvasBgRef.current.width = 1024;
            canvasBgRef.current.height = 1024;
            const ctx = canvasBgRef.current?.getContext('2d');
            if (!ctx) {
                return
            }
            const {
                background
            } = mediaData || {};
            const { data, width, height } = background;
            ctx.drawImage(srcRef.current!, 0, 0, width, height);

            const imageData = ctx.getImageData(0, 0, width, height);

            if (bgType === BG_TYPE.OPACITY) {
                for (let index = 0; index < data.length; index++) {
                    const point = data[index];
                    if (point !== 0) {
                        imageData.data[index * 4 + 3] = 0;
                    }
                }
            }

            if (bgType === BG_TYPE.ONE) {
                for (let index = 0; index < data.length; index++) {
                    const point = data[index];
                    if (point !== 0) {
                        const r = parseInt(color.slice(1, 3), 16);
                        const g = parseInt(color.slice(3, 5), 16);
                        const b = parseInt(color.slice(5, 7), 16);
                        imageData.data[index * 4 + 0] = r;
                        imageData.data[index * 4 + 1] = g;
                        imageData.data[index * 4 + 2] = b;
                    }
                }
            }
            ctx.putImageData(imageData, 0, 0);
        }

    }, [mediaData, bgType, color])

    const [bgTypeHair, setBgTypeHair] = useState(BG_TYPE.OPACITY);

    const onBgChangeHair = (value: BG_TYPE) => {
        setBgTypeHair(value)
    }

    const [colorHair, setColorHair] = useState('#000000');
    const changeColorHair = (event: any) => {
        setColorHair(event.target.value)
    }


    useEffect(() => {
        console.log('mediaData', mediaData);

        if (mediaData) {
            if (!canvasHairRef.current) {
                console.log('canvasHairRef.current', canvasHairRef.current);
                return
            }
            canvasHairRef.current.width = 1024;
            canvasHairRef.current.height = 1024;
            const ctx = canvasHairRef.current?.getContext('2d');
            if (!ctx) {
                return
            }
            const {
                hair
            } = mediaData || {};
            const { data, width, height } = hair;
            ctx.drawImage(srcRef.current!, 0, 0, width, height);

            const imageData = ctx.getImageData(0, 0, width, height);
            const color = colorHair;
            if (bgTypeHair === BG_TYPE.ONE) {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                const colorNew = ColorLib.rgb([r, g, b]);

                const newHue = colorNew.hue();
                for (let index = 0; index < data.length; index++) {
                    const point = data[index];
                    if (point !== 0) {

                        const colorOrigin = ColorLib.rgb([imageData.data[index * 4], imageData.data[index * 4 + 1], imageData.data[index * 4 + 2]]);
                        const hue = colorOrigin.hue();

                        const newColor = colorOrigin.hue(hue + newHue).rgb().array();
                        imageData.data[index * 4 + 0] = newColor[0];
                        imageData.data[index * 4 + 1] = newColor[1];
                        imageData.data[index * 4 + 2] = newColor[2];
                    }
                }
            }
            ctx.putImageData(imageData, 0, 0);
        }

    }, [mediaData, bgTypeHair, colorHair])

    return (
        <div>
            <div className='mt-5 flex w-full h-full'>
                <Card className="min-w-[300px] min-h-[400px]">
                    <CardContent className={'p-5'}>
                        <Image ref={srcRef} src='/a.png' width={512} height={512} alt='img' loader={loaderProp} />
                    </CardContent>
                    <CardFooter className={'flex justify-around items-center'}>
                        <Button onClick={onStart}>开始</Button>
                    </CardFooter>
                </Card>

                <Card className="min-w-[300px] min-h-[400px] ml-4">
                    <CardContent className={'p-5'}>
                        <canvas width={512} height={512} ref={canvasRef} className={'w-[512px] h-[512px]'}></canvas>
                    </CardContent>
                    <CardFooter className={'flex justify-around items-center'}>
                        <Button onClick={() => { }}>下载</Button>
                    </CardFooter>

                </Card>


            </div>
            <div className='mt-5 flex w-full h-full'>
                <Card className="min-w-[300px] min-h-[400px] ml-4">
                    <CardContent className={'p-5'}>
                        <canvas width={512} height={512} ref={canvasBgRef} className={'w-[512px] h-[512px]'}></canvas>
                    </CardContent>
                    <CardFooter className={'flex justify-around items-center'}>
                        <div >
                            <RadioGroup value={bgType} onValueChange={onBgChange}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="random" id="random" />
                                    <Label htmlFor="random">背景图</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="one" id="one" />
                                    <Label htmlFor="one">颜色背景</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="opacity" id="opacity" />
                                    <Label htmlFor="opacity">透明背景</Label>
                                </div>
                            </RadioGroup>
                        </div >
                        <div className={'w-[200px] ml-[48px]'}>{
                            (bgType === BG_TYPE.ONE) && (
                                <div className={'flex justify-around items-center'}>
                                    <Label htmlFor="color" className={'text-nowrap'}>背景色</Label>
                                    <Input value={color} onChange={changeColor} type="color"></Input>
                                </div>
                            )}
                        </div>
                        <Button onClick={() => { }}>下载</Button>
                    </CardFooter>
                </Card>
                <Card className="min-w-[300px] min-h-[400px] ml-4">
                    <CardContent className={'p-5'}>
                        <canvas width={512} height={512} ref={canvasHairRef} className={'w-[512px] h-[512px]'}></canvas>
                    </CardContent>
                    <CardFooter className={'flex justify-around items-center'}>
                        <div >
                            <RadioGroup value={bgTypeHair} onValueChange={onBgChangeHair}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="one" id="one" />
                                    <Label htmlFor="one">颜色背景</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="opacity" id="opacity" />
                                    <Label htmlFor="opacity">透明背景</Label>
                                </div>
                            </RadioGroup>
                        </div >
                        <div className={'w-[200px] ml-[48px]'}>{
                            (bgTypeHair === BG_TYPE.ONE) && (
                                <div className={'flex justify-around items-center'}>
                                    <Label htmlFor="color" className={'text-nowrap'}>背景色</Label>
                                    <Input value={colorHair} onChange={changeColorHair} type="color"></Input>
                                </div>
                            )}
                        </div>
                        <Button onClick={() => { }}>下载</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>


    );
}