import { onDownload } from '@/utils/image';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { LazyImage } from './LazyImage';

// 图片数据的类型
interface Image {
    url: string;
    alt: string;
}

// 单元格的属性类型
interface CellProps {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
    data: {
        images: Image[];
        columnCount: number;
        columnWidth: number;
    };
}

// 瀑布流组件的属性类型
interface MasonryLayoutProps {
    images: Image[];
}

const columnWidth = 342;
const rowHeight = 400;
const gap = 24;

const CardCell: React.FC<CellProps> = ({ columnIndex, rowIndex, style, data }) => {
    const { images, columnCount } = data;
    const imageIndex = rowIndex * columnCount + columnIndex;
    const image = images[imageIndex];

    if (!image) return null;

    const rowInIndex = imageIndex % columnCount;

    return (
        <Card className="w-[342px] h-[400px]" style={{
            ...style,
            boxSizing: 'border-box',
            left: `${(columnWidth + gap) * rowInIndex}px`,
            top: `${(rowHeight + gap) * rowIndex}px`
        }} key={image.url}>
            <CardContent className={'p-5'}>
                <LazyImage
                    src={image.url}
                    alt={'index'}
                    width={300}
                    height={300}
                />
            </CardContent>
            <CardFooter className={'flex justify-around items-center'}>
                <Button onClick={() => onDownload(`${image.url}&save=save`)} variant="outline"> 下载 </Button>
            </CardFooter>
        </Card>
    );
};

const MasonryLayout: React.FC<MasonryLayoutProps> = ({ images }: MasonryLayoutProps) => {
    const [containerWidth, setContainerWidth] = useState<number>(1200);
    const [containerHeight, setContainerHeight] = useState<number>(800);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
                setContainerHeight(window.innerHeight - 154);
            }
        };

        const resizeObserver = new ResizeObserver(handleResize);
        const currentContainer = containerRef.current;
        if (currentContainer) {
            resizeObserver.observe(currentContainer);
        }

        handleResize();

        return () => {
            if (currentContainer) {
                resizeObserver.unobserve(currentContainer);
            }
        };
    }, []);

    const getColumnCount = useCallback(() => {
        return Math.floor(containerWidth / columnWidth);
    }, [containerWidth]);

    const getRowHeight = useCallback((index: number) => rowHeight, []);

    const columnCount = getColumnCount();
    const rowCount = Math.ceil(images.length / columnCount);

    return (
        <div ref={containerRef} style={{ width: '100%' }}>
            <Grid
                columnCount={columnCount}
                columnWidth={() => columnWidth}
                height={containerHeight}
                rowCount={rowCount}
                rowHeight={getRowHeight}
                width={containerWidth}
                itemData={{ images, columnCount, columnWidth }}
            >
                {CardCell}
            </Grid>
        </div>
    );
};

export default MasonryLayout;
