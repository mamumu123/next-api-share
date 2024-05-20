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
  const loaderProp = ({ src }: { src: string }) => {
    return src;
  }

  return (
    <div className={`flex min-h-screen flex-col  p-12`}>
      <h1 className={'text-center text-lg'}>潦草头像</h1>
      <a href={"https://github.com/mamumu123/next-api-share"} className={'fixed right-5 top-5'}>
        <Image src="https://github.githubassets.com/favicons/favicon.svg" width='50' height="50" alt="https://github.com/mamumu123/next-api-share" />
      </a>
      <div
        className={`flex h-100 w-full  p-24 flex-wrap gap-6`}
      >
        {demoList.map((item) => (
          <Card className="min-w-[220px]  max-w-[250px] flex-1" key={item}>
            <CardContent className={'p-5'}>
              <Image src={item} alt={'index'} width={200} height={200} loader={loaderProp} />
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
