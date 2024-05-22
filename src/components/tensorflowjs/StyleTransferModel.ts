import * as tf from '@tensorflow/tfjs';
import { MutableRefObject } from 'react';
tf.ENV.set('WEBGL_PACK', false);


class StyleTransferModel {
    pathStyleNetwork: string
    pathTransformerNetwork: string
    styleNetwork!: tf.GraphModel<string | tf.io.IOHandler>
    transformerNetwork!: tf.GraphModel<string | tf.io.IOHandler>
    contentRef!: MutableRefObject<HTMLImageElement | undefined>
    styleRef!: MutableRefObject<HTMLImageElement | undefined>
    outputRef!: MutableRefObject<HTMLCanvasElement | undefined>

    constructor(pathStyleNetwork: string, pathTransformerNetwork: string) {
        this.pathStyleNetwork = pathStyleNetwork;
        this.pathTransformerNetwork = pathTransformerNetwork;
    }

    donwloadModel(onDownloadSuccessful: () => void, onDownloadFailed: () => void) {
        Promise.all([
            this.loadModelFromPath(this.pathStyleNetwork),
            this.loadModelFromPath(this.pathTransformerNetwork)
        ]).then(([styleNet, transformerNet]) => {
            this.styleNetwork = styleNet;
            this.transformerNetwork = transformerNet;
            onDownloadSuccessful();
        }).catch(err => {
            console.error('err', err)
            onDownloadFailed();
        })
    }

    async loadModelFromPath(path: string) {
        return await tf.loadGraphModel(path);
    }

    setValueAccessors(contentRef: MutableRefObject<HTMLImageElement | undefined>, styleRef: MutableRefObject<HTMLImageElement | undefined>, outputRef: MutableRefObject<HTMLCanvasElement | undefined>) {
        this.contentRef = contentRef;
        this.styleRef = styleRef;
        this.outputRef = outputRef;
    }

    async generateStyledImage(styleRatio: number, onImageGenerated: Function, onError: () => void) {
        await tf.nextFrame();
        await tf.nextFrame();
        await tf.nextFrame();
        try {
            let features = await tf.tidy(() => {
                return this.styleNetwork.predict(
                    tf.browser.fromPixels(this.styleRef.current!).toFloat().div(tf.scalar(255)).expandDims());
            });

            if (styleRatio !== 1.0) {
                const content_features = await tf.tidy(() => {
                    return this.styleNetwork.predict(tf.browser.fromPixels(this.contentRef.current!).toFloat().div(tf.scalar(255)).expandDims());
                });
                const style_features = features;

                // features = await tf.tidy(() => {
                //     const styleFeaturesScaled = style_features.mul(tf.scalar(styleRatio));
                //     const contentFeaturesScaled = content_features.mul(tf.scalar(1.0 - styleRatio));
                //     return styleFeaturesScaled.addStrict(contentFeaturesScaled);
                // });

                // content_features.dispose();
                // style_features.dispose();
            }

            // const stylizedImage = await tf.tidy(() => {
            //     return this.transformerNetwork.predict(
            //         [
            //             tf.browser.fromPixels(this.contentRef.current!).toFloat().div(tf.scalar(255)).expandDims(),
            //             features
            //         ])
            //     // .squeeze();
            // })
            await tf.nextFrame();
            onImageGenerated(this.contentRef.current!.src);
            // await tf.browser.toPixels(stylizedImage, this.outputRef.current!);
            // features.dispose();
            // stylizedImage.dispose();
        } catch (err) {
            console.log(err);
            onError();
        }

    }
}

export {
    StyleTransferModel
};