import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';
import { dbFileDexie as db } from '@/lib/db'

export const useAssetData = () => {

    const mediaList = useLiveQuery(
        () => db.files?.toArray?.()
    );

    const media = useMemo(() => mediaList?.length ? mediaList[0] : null, [mediaList])

    const mediaData = useMemo(() => media?.data ?? null, [media]);
    const mediaName = useMemo(() => media?.name ?? null, [media]);


    const saveAsset = (name: string, data: any) => {
        db.files.put({ name, data })
    }

    return {
        media,
        saveAsset,
        mediaData,
        mediaName,
    };
};
