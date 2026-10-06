import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type ToolbarButton = {
    action: 'camera' | 'play' | 'view' | 'share' | 'info';
    accessibilityLabel: string;
    icon: ComponentProps<typeof Feather>['name'];
};

const buttons: ToolbarButton[] = [
    { accessibilityLabel: 'Camera', action: 'camera', icon: 'camera' },
    { accessibilityLabel: 'Play', action: 'play', icon: 'play' },
    { accessibilityLabel: 'View', action: 'view', icon: 'eye' },
    { accessibilityLabel: 'Share', action: 'share', icon: 'share' },
    { accessibilityLabel: 'Info', action: 'info', icon: 'info' },
];

const handlePress = () => undefined;

type ToolbarProps = {
    onCameraPress?: () => void;
    onPlayPress?: () => void;
    onViewPress?: () => void;
    onInfoPress?: () => void;
};

export default function Toolbar({
    onCameraPress = handlePress,
    onPlayPress = handlePress,
    onViewPress = handlePress,
    onInfoPress = handlePress
}: ToolbarProps) {
    return (
        <View accessibilityRole="toolbar" style={styles.toolbar}>
            {buttons.map((button) => (
                <Pressable
                    accessibilityLabel={button.accessibilityLabel}
                    accessibilityRole="button"
                    key={button.accessibilityLabel}
                    onPress={
                        button.action === 'camera'
                            ? onCameraPress
                            : button.action === 'play'
                                ? onPlayPress
                                : button.action === 'view'
                                    ? onViewPress
                                    : button.action === 'info'
                                        ? onInfoPress
                                        : handlePress
                    }
                    style={styles.button}
                >
                    <Feather color="black" name={button.icon} size={24} />
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    toolbar: {
        backgroundColor: '#ffffff',
        borderTopColor: '#000000',
        borderTopWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        height: 64,
        marginTop: 'auto',
        width: '100%',
        zIndex: 1000
    },
    button: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
});