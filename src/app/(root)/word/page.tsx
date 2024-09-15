"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_WORD } from "@/constants/word";
import { useState } from "react";
import Image from "next/image";
import { div } from "@tensorflow/tfjs";

export default function Home() {

    console.log(111)

    const [src, setSrc] = useState('')

    const onChange = async () => {
        const word = await fetch(API_WORD, {
            method: 'post',
            body: JSON.stringify({
                text: '外卖'
            })
        }).then((res) => res.text()) as string;
        console.log('word', word);
        setSrc(word);
    }

    return (
        <div className={`flex min-h-screen flex-col  p-12`}>
            <h2 className="text-7xl font-serif">汉语新解（复刻版）</h2>
            <p>给一个中文词汇，就生成一张精美的卡片，帮您进行解读。</p>
            <Input />
            <Button onClick={onChange}>ssss</Button>
            {
                src && (
                    <div dangerouslySetInnerHTML={{ __html: src }} />
                )
            }

        </div>
    );
}