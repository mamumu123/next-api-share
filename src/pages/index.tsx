import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { range } from 'lodash-es';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { nanoid } from 'nanoid'

const api = `/api/face`;

export default function Home() {
  const [demoList, setDemoList] = useState<string[]>([]);

  const onSwitch = () => {
    setDemoList(() => range(0, 10).map(() => `${api}?id=${nanoid()}`))
  }

  useEffect(() => {
    onSwitch()
  }, []);

  const onDownload = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.svg';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className={`flex min-h-screen flex-col  p-12`}>
      <h1 className={'text-center text-lg'}>潦草头像</h1>
      <div
        className={`flex h-100 w-full  p-24 flex-wrap gap-6`}
      >
        {demoList.map((item) => (
          <Card className="w-[220px]" key={item}>
            <CardContent className={'p-5'}>
              <Image src={item} alt={'index'} width={200} height={200} />
            </CardContent>
            <CardFooter className={'flex justify-center items-center'}>
              <Button onClick={() => onDownload(item)}> 下载 </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Button onClick={onSwitch}> 换一波 </Button>
    </div>

  );
}
