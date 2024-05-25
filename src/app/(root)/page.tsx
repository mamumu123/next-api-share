"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { range } from 'lodash-es';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { nanoid } from 'nanoid'
import Link from "next/link";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { API_FACE, BG_TYPE, FAV_ICON, GIT_REPO } from "@/constants";
import { loaderProp, onDownload } from "@/utils/image";

export default function Home() {
  const [demoList, setDemoList] = useState<string[]>([]);

  const [bgType, setBgType] = useState(BG_TYPE.RANDOM);
  const onBgChange = (value: BG_TYPE) => {
    setBgType(value)
  }

  const onSwitch = () => {
    setDemoList(() => range(0, 10).map(() => `${API_FACE}?id=${nanoid()}`))
  }

  useEffect(() => {
    onSwitch()
  }, []);


  return (
    <div className={`flex min-h-screen flex-col w-full p-2`}>
      <a href={GIT_REPO} className={'fixed right-5 top-5'}>
        <Image src={FAV_ICON} width='50' height="50" alt={GIT_REPO} />
      </a>
      <div className={'m-5 flex  items-center'}>
        <div >
          <RadioGroup defaultValue={bgType} onValueChange={onBgChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="random" id="random" />
              <Label htmlFor="random">随机背景</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="one" id="one" />
              <Label htmlFor="one">固定颜色背景</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="opacity" id="opacity" />
              <Label htmlFor="opacity">透明背景</Label>
            </div>
          </RadioGroup>
        </div >

        <div className={'w-[200px]'}>
          {
            bgType === BG_TYPE.ONE && (
              <>
                <div className={'flex justify-around items-center'}>
                  <label htmlFor="hs-color-input" className=" text-sm font-medium mb-2 dark:text-white flex items-center mr-5">背景色</label>
                  <input type="color" className="p-1 h-10 w-14  bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700" id="hs-color-input" value="#2563eb" title="Choose your color"></input>
                </div>
              </>
            )
          }
        </div>
        <Button onClick={onSwitch}> 换一波 </Button>
      </div>
      <div
        className={`flex h-100 w-full flex-wrap gap-6`}
      >
        {demoList.map((item) => (
          <Card className="min-w-[300px] h-[400px]" key={item}>
            <CardContent className={'p-5'}>
              <Image src={item} alt={'index'} width={300} height={300} loader={loaderProp} />
            </CardContent>
            <CardFooter className={'flex justify-around items-center'}>
              <Button onClick={() => onDownload(item)} variant="outline"> 下载 </Button>
              {/* <Link href={`/styled/?url=${item}`}>
                <Button variant="secondary"> 编辑 </Button>
              </Link> */}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>

  );
}
