export const onDownload = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.svg';
    a.click();
    window.URL.revokeObjectURL(url);
}

export const loaderProp = ({ src }: { src: string }) => {
    return src;
}

export function getCenter(data: number[], width: number, height: number) {
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