import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from "next/image";

export function LazyImage({ src = '', alt = '', width = 300, height = 300 }) {
    const [loaded, setLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState('http://localhost:3000/assets/logo.png');

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    useEffect(() => {
        if (inView) {
            const worker = new Worker(new URL('../workers/imageWorker.js', import.meta.url));
            worker.postMessage({ src });
            worker.onmessage = (event) => {
                const base64data = event.data;
                if (base64data) {
                    setImageSrc(base64data);
                }
                worker.terminate();
            };

            return () => {
                worker.terminate();
            };
        }
    }, [inView, src]);

    return (
        <div ref={ref} style={{ width, height }}>
            {inView && <>
                <Image
                    unoptimized={true}
                    priority
                    src={imageSrc}
                    alt={alt}
                    width={width}
                    height={height}
                    placeholder="blur"
                    blurDataURL="http://localhost:3000/assets/logo.png"
                    onLoad={() => setLoaded(true)}
                    style={{
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out',
                    }} />
            </>}
        </div>
    );
}
