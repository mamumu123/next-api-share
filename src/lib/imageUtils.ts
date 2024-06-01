export function findBorders(data: number[], width: number, height: number) {
    const borders = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = y * width + x;
            const value = data[index];
            if (value !== 0) {
                // 检查上下左右四个邻居
                const top = data[index - width];
                const bottom = data[index + width];
                const left = data[index - 1];
                const right = data[index + 1];
                if (top === 0 || bottom === 0 || left === 0 || right === 0) {
                    // 如果任何一个邻居是0，那么这个点就是边界
                    borders.push({ x, y });
                }
            }
        }
    }
    return borders;
}
