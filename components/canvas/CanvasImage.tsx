import { Image, StyleSheet, View } from 'react-native';
import type { SelectedImage } from '../camera/imageSelection';

type CanvasImageProps = {
    image: SelectedImage | null;
};

export default function CanvasImage({ image }: CanvasImageProps) {
    if (!image) {
        return null;
    }

    return (
        <View pointerEvents="none" style={styles.image}>
            <Image
                accessibilityLabel="Selected image"
                resizeMode="contain"
                source={{ uri: image.uri }}
                style={styles.image}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000000',
    },
});