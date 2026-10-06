import Canvas, { Image } from 'react-native-canvas';

import type { Configuration } from '../app/configuration';

const mapNumber = (
    value: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

const isTooBlack = (r: number, g: number, b: number, threshold: number) =>
    r < threshold && g < threshold && b < threshold;

const extractImageFromCanvas = async ({
    src,
    target,
    callback,
}: {
    src: Canvas;
    target: Canvas;
    callback: (img: Image) => void;
}) => {
    let dataUrl = await src.toDataURL();
    dataUrl = dataUrl.replace(/^"|"$/g, '');
    const ImageClass = (target.constructor as any).Image || Image;
    const img = new ImageClass(target);
    const handleLoad = async () => {
        callback(img);
    };
    img.addEventListener('load', handleLoad);
    img.src = dataUrl;
};

/**
 * Process the image, this is the algorithm to make the ascii art
 */
export async function processImage({
    config,
    srcImg,
    resizedImg,
    resultCanvas,
}: {
    config: Configuration;
    srcImg: Canvas | null;
    resizedImg: Canvas | null;
    resultCanvas: Canvas | null;
}) {
    if (!srcImg || !resizedImg || !resultCanvas) {
        throw new Error('Can not proceed without canvas.');
    }

    const letterOrder =
        ' .`-_\':,;^=+/"|(\\<>)iv%xclrs{*}I?!][1taeo7zjLunT#JCwfy325Fp6mqSghVd4EgXPGZbYkOA&8U$@KHDBWNMR0Q';
    const letters: string[] = new Array(256);
    for (let i = 0; i < 256; i++) {
        const j = Math.trunc(mapNumber(i, 0, 256, 0, letterOrder.length));
        letters[i] = letterOrder[j] ?? '';
    }

    let resizedWidth: number;
    let resizedHeight: number;
    let resultWidth: number;
    let resultHeight: number;
    if (srcImg.width >= srcImg.height) {
        resizedWidth = config.chars;
        resizedHeight = Math.floor(
            (resizedWidth * srcImg.height) / srcImg.width,
        );
        if (
            srcImg.width / srcImg.height >= 1.7 &&
            srcImg.width / srcImg.height <= 1.8
        ) {
            resultHeight = 1080;
            resultWidth = 1920;
        } else {
            resultHeight = 1080;
            resultWidth = Math.floor(
                (resultHeight * srcImg.width) / srcImg.height,
            );
        }
    } else {
        resizedHeight = config.chars;
        resizedWidth = Math.floor(
            (resizedHeight * srcImg.width) / srcImg.height,
        );
        if (
            srcImg.height / srcImg.width >= 1.7 &&
            srcImg.height / srcImg.width <= 1.8
        ) {
            resultWidth = 1080;
            resultHeight = 1920;
        } else {
            resultWidth = 1080;
            resultHeight = Math.floor(
                (resultWidth * srcImg.height) / srcImg.width,
            );
        }
    }

    const resizedCtx = resizedImg.getContext('2d');
    if (!resizedCtx) {
        throw new Error('Could not get the resized image context.');
    }
    await extractImageFromCanvas({
        src: srcImg,
        target: resizedImg,
        callback: (img: Image) => {
            resizedCtx.drawImage(img, 0, 0, resizedWidth, resizedHeight);
        },
    });

    const imageData = await resizedCtx.getImageData(
        0,
        0,
        resizedWidth,
        resizedHeight,
    );
    const pixels = imageData.data;
    const lights = mapNumber(config.lights, 1, 5, 1, 2);
    const letterMatrix: string[] = new Array(resizedWidth * resizedHeight);
    const fontMatrix: number[] = new Array(resizedWidth * resizedHeight);
    const colorMatrix: string[] = new Array(resizedWidth * resizedHeight);

    for (let pos = 0; pos < resizedWidth * resizedHeight; pos++) {
        const pixPos = pos * 4;
        const threshold = isTooBlack(
            pixels[pixPos] ?? 0,
            pixels[pixPos + 1] ?? 0,
            pixels[pixPos + 2] ?? 0,
            config.inferior,
        );
        if (!threshold) {
            if (config.blackWhite) {
                colorMatrix[pos] = 'rgba(0, 0, 0, 1)';
            } else {
                colorMatrix[pos] =
                    `rgba(${(pixels[pixPos] ?? 0) * lights}, ${(pixels[pixPos + 1] ?? 0) * lights}, ${(pixels[pixPos + 2] ?? 0) * lights}, 1)`;
            }
        } else {
            letterMatrix[pos] = ' ';
            fontMatrix[pos] = 0;
            colorMatrix[pos] = 'rgba(0, 0, 0, 0)';
            continue;
        }

        const pixelBright = Math.max(
            pixels[pixPos] ?? 0,
            pixels[pixPos + 1] ?? 0,
            pixels[pixPos + 2] ?? 0,
        );
        letterMatrix[pos] =
            config.text === ''
                ? (letters[pixelBright] ?? '')
                : (config.text[pos % config.text.length] ?? '');
        fontMatrix[pos] =
            config.map > 0
                ? config.invertMap
                    ? mapNumber(
                          pixelBright,
                          0,
                          0xff,
                          1 + config.font / 10,
                          config.map / 10,
                      )
                    : mapNumber(
                          pixelBright,
                          0,
                          0xff,
                          config.map / 10,
                          1 + config.font / 10,
                      )
                : 1 + config.font / 10;
    }

    resultCanvas.width = resultWidth;
    resultCanvas.height = resultHeight;
    let resultCtx = resultCanvas.getContext('2d');
    if (!resultCtx) {
        throw new Error('Could not get the result image context.');
    }
    if (config.blackWhite) {
        resultCtx.fillStyle = 'white';
        resultCtx.fillRect(0, 0, resultCanvas.width, resultCanvas.height);
    }

    const fSize = 1 + config.font / 10;
    resultCtx.save();
    resultCtx.scale(
        (resultCanvas.width / resizedWidth) * fSize,
        (resultCanvas.height / resizedHeight) * fSize,
    );
    for (let j = 0, pos = 0; j < resizedHeight; j++) {
        resultCtx.translate(0, 1.0 / fSize);
        resultCtx.save();
        for (let i = 0; i < resizedWidth; i++, pos++) {
            resultCtx.fillStyle = colorMatrix[pos] ?? 'rgba(0, 0, 0, 0)';
            resultCtx.font = `${fontMatrix[pos] ?? 0}px ${config.family}`;
            resultCtx.fillText(letterMatrix[pos] ?? '', 0, 0);
            resultCtx.translate(1.0 / fSize, 0);
        }
        resultCtx.restore();
    }
    resultCtx.restore();
}

/**
 * Switch between showing the source image and processed image
 */
export async function showImage({
    preview,
    canvas,
}: {
    preview: Canvas | null;
    canvas: Canvas | null;
}) {
    if (!preview || !canvas) {
        throw new Error('Can not proceed without canvas.');
    }

    let x = 0,
        y = 0,
        w = 0,
        h = 0;

    // Adjust the size of the resulting image in order to preview it
    if (
        (preview.width >= preview.height && canvas.width > canvas.height) ||
        (preview.width < preview.height && canvas.height < canvas.width)
    ) {
        h = canvas.height;
        w = Math.floor((h * preview.width) / preview.height);
        x = Math.floor((canvas.width - w) / 2);
    } else if (
        (preview.width >= preview.height && canvas.width < canvas.height) ||
        (preview.width < preview.height && canvas.height > canvas.width)
    ) {
        w = canvas.width;
        h = Math.floor((w * preview.height) / preview.width);
        y = Math.floor((canvas.height - h) / 2);
    }

    // Show the image in the main canvas
    await extractImageFromCanvas({
        src: preview,
        target: canvas,
        callback: (img: Image) => {
            // Clear the canvas and draw result
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, x, y, w, h);
        },
    });
}
