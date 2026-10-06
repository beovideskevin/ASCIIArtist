import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View, useWindowDimensions } from 'react-native';
import Canvas, { Image } from 'react-native-canvas';
import {
    selectImage,
    type ImageSource,
    type SelectedImage,
} from '../components/camera/imageSelection';
import Toolbar from '../components/toolbar/Toolbar';
import { processImage, showImage } from '../utils/ascii';
import { getLastConfiguration } from './configuration';

export default function IndexScreen() {
    const { width, height } = useWindowDimensions();

    const canvasRef = useRef<Canvas | null>(null);
    const originalCanvasRef = useRef<Canvas | null>(null);
    const resultCanvasRef = useRef<Canvas | null>(null);
    const resizeCanvasRef = useRef<Canvas | null>(null);

    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
        null,
    );
    const [itWasProcessed, setItWasProcessed] = useState(false);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;
    });

    useEffect(() => {
        if (!selectedImage || !originalCanvasRef.current) {
            return;
        }

        const canvas = originalCanvasRef.current;
        const image = new Image(canvas);
        const formattedUri = selectedImage.base64.startsWith('data:')
            ? selectedImage.base64
            : `data:image/jpeg;base64,${selectedImage.base64}`;
        const handleLoad = async () => {
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            await showImage({
                preview: originalCanvasRef.current,
                canvas: canvasRef.current
            });
            setShowResult(false);
            setItWasProcessed(false);
        };
        image.addEventListener('load', handleLoad);
        image.src = formattedUri;
    }, [selectedImage]);

    const handleCameraPress = async () => {
        const source = await new Promise<ImageSource | null>((resolve) => {
            Alert.alert(
                'Choose an image source',
                'Take a picture or select from your gallery.',
                [
                    {
                        onPress: () => resolve(null),
                        style: 'cancel',
                        text: 'Cancel',
                    },
                    { onPress: () => resolve('camera'), text: 'Camera' },
                    { onPress: () => resolve('gallery'), text: 'Gallery' },
                ],
                { cancelable: true }
            );
        });
        if (!source) {
            return;
        }

        const result = await selectImage(source);
        if (result.kind === 'selected') {
            const manipulatedImage = await ImageManipulator.manipulateAsync(
                result.image.uri,
                [{ resize: { width } }], // Scales height proportionally
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true } // Compresses file size
            );

            // Pass this much lighter URI to your canvas
            result.image.uri = manipulatedImage.uri;
            result.image.base64 = manipulatedImage.base64 || "";
            setSelectedImage(result.image);
        } else if (result.kind === 'failed') {
            Alert.alert('Image selection failed', result.message);
        }
    };

    const handlePlayPress = async () => {
        if (selectedImage && canvasRef.current) {
            router.push('/configuration');
            try {
                // DEBUG
                await showImage({
                    preview: originalCanvasRef.current,
                    canvas: canvasRef.current
                });
                await processImage({
                    config: getLastConfiguration(),
                    srcImg: originalCanvasRef.current,
                    resizedImg: resizeCanvasRef.current,
                    resultCanvas: resultCanvasRef.current
                });
                setItWasProcessed(true);
                setShowResult(true);
                await showImage({
                    preview: resultCanvasRef.current,
                    canvas: canvasRef.current
                });
            } catch {
                Alert.alert('ASCII conversion failed', 'The selected image could not be processed.');
            }
        }
    };

    return (
        <View style={styles.screen}>
            <Canvas ref={canvasRef} style={styles.canvas} />
            <Canvas ref={originalCanvasRef} style={styles.offScreenCanvas} />
            <Canvas ref={resizeCanvasRef} style={styles.offScreenCanvas} />
            <Canvas ref={resultCanvasRef} style={styles.offScreenCanvas} />

            <Toolbar
                onCameraPress={handleCameraPress}
                onPlayPress={handlePlayPress}
                onViewPress={async () => {
                    if (itWasProcessed) {
                        const shouldShowResult = !showResult;
                        await showImage({
                            preview: shouldShowResult ? resultCanvasRef.current : originalCanvasRef.current,
                            canvas: canvasRef.current
                        })
                        setShowResult(shouldShowResult);
                    }
                }}
                onInfoPress={
                    async () => {
                        // Opens the URL in an embedded browser modal
                        await WebBrowser.openBrowserAsync('https://www.eldiletante.com');
                    }
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    canvas: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000000',
    },
    offScreenCanvas: {
        position: 'absolute',
        opacity: 0,
        pointerEvents: 'none',
        left: -9999
    },
    icon: {
        alignSelf: 'center',
        height: 96,
        marginTop: 48,
        width: 96,
    },
    title: {
        alignSelf: 'center',
        marginTop: 24,
    },
});