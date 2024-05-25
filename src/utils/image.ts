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