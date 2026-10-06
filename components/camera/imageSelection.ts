import * as ImagePicker from 'expo-image-picker';

export type ImageSource = 'camera' | 'gallery';

export type SelectedImage = {
    uri: string;
    height: number;
    width: number;
    base64: string;
};

export type ImageSelectionResult =
    | { kind: 'selected'; image: SelectedImage }
    | { kind: 'cancelled' }
    | { kind: 'failed'; message: string };

export async function selectImage(
    source: ImageSource,
): Promise<ImageSelectionResult> {
    try {
        if (source === 'camera') {
            const permission =
                await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                return {
                    kind: 'failed',
                    message: 'Camera access is required to take a picture.',
                };
            }
        }

        const result =
            source === 'camera'
                ? await ImagePicker.launchCameraAsync({
                      allowsEditing: false,
                      base64: true,
                      mediaTypes: ['images'],
                      quality: 0.8,
                  })
                : await ImagePicker.launchImageLibraryAsync({
                      allowsEditing: false,
                      mediaTypes: ['images'],
                      quality: 0.8,
                  });

        if (result.canceled) {
            return { kind: 'cancelled' };
        }

        const asset = result.assets[0];
        if (
            !asset ||
            asset.width <= 0 ||
            asset.height <= 0 ||
            !asset.uri ||
            !asset.base64
        ) {
            return {
                kind: 'failed',
                message: 'The selected image could not be loaded.',
            };
        }

        return {
            image: {
                uri: asset.uri,
                base64: asset.base64,
                height: asset.height,
                width: asset.width,
            },
            kind: 'selected',
        };
    } catch {
        return { kind: 'failed', message: 'The image could not be selected.' };
    }
}
