import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from "next/image";
import { placeholder } from './placeholder';

export function LazyImage({ src = '', alt = '', width = 300, height = 300 }) {
    const [loaded, setLoaded] = useState(false);

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.25,
    });

    return (
        <div ref={ref} style={{ width, height }}>
            {inView && <>
                <Image
                    unoptimized={true}
                    priority
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    placeholder={placeholder}
                    onLoad={() => setLoaded(true)}
                    style={{
                        opacity: loaded ? 1 : 0.5,
                        transition: 'opacity 0.5s ease-in-out',
                    }} 
                />
            </>}
        </div>
    );
}
