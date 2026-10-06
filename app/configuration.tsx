import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type Configuration = {
    chars: number;
    family: string;
    font: number;
    text: string;
    map: number;
    inferior: number;
    lights: number;
    blackWhite: boolean;
    invertMap: boolean;
    printSize: boolean;
    framed: boolean;
};

const familyOptions = ['SpaceMono', 'URWBookman'];
const fontOptions = [2, 3, 4, 5, 6, 7, 8];
const mapOptions = [0, 2, 4, 6, 8];
const inferiorOptions = [0, 4, 8, 12, 16, 20, 24];

const initialConfiguration: Configuration = {
    chars: 100,
    family: familyOptions[0],
    font: 4,
    text: '',
    map: 2,
    inferior: 0,
    lights: 2,
    blackWhite: false,
    invertMap: false,
    printSize: false,
    framed: false,
};

let lastConfiguration = initialConfiguration;

export function getLastConfiguration(): Configuration {
    return { ...lastConfiguration };
}

type NumericField = 'chars' | 'font' | 'map' | 'inferior' | 'lights';
type BooleanField = 'blackWhite' | 'invertMap';

export default function ConfigurationScreen() {
    const router = useRouter();
    const [configuration, setConfiguration] = useState(() => ({ ...lastConfiguration }));
    const [familyMenuOpen, setFamilyMenuOpen] = useState(false);
    const [fontMenuOpen, setFontMenuOpen] = useState(false);
    const [mapMenuOpen, setMapMenuOpen] = useState(false);
    const [inferiorMenuOpen, setInferiorMenuOpen] = useState(false);

    const updateNumber = (field: NumericField, value: string) => {
        const numberValue = Number(value.replace(/[^0-9]/g, ''));
        setConfiguration((current) => ({ ...current, [field]: numberValue }));
    };

    const updateBoolean = (field: BooleanField) => {
        setConfiguration((current) => ({ ...current, [field]: !current[field] }));
    };

    const handleCancel = () => {
        setConfiguration({ ...lastConfiguration });
        router.back();
    };

    const handleApply = () => {
        lastConfiguration = { ...configuration };
        router.back();
    };

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
            <View style={styles.header}>
                <Text style={styles.title}>Render Configuration</Text>
                <Text style={styles.subtitle}>Tune the values to control the rendering.</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Character treatment</Text>
                    <NumberInput label="Characters" value={configuration.chars} onChangeText={(value) => updateNumber('chars', value)} />
                    <Text style={styles.label}>Font family</Text>
                    <Pressable accessibilityRole="button" onPress={() => setFamilyMenuOpen((open) => !open)} style={styles.select}>
                        <Text style={styles.inputText}>{configuration.family}</Text>
                        <Text style={styles.chevron}>{familyMenuOpen ? '^' : 'v'}</Text>
                    </Pressable>
                    {familyMenuOpen ? (
                        <View style={styles.menu}>
                            {familyOptions.map((family) => (
                                <Pressable key={family} onPress={() => { setConfiguration((current) => ({ ...current, family })); setFamilyMenuOpen(false); }} style={styles.menuOption}>
                                    <Text style={styles.inputText}>{family}</Text>
                                </Pressable>
                            ))}
                        </View>
                    ) : null}
                    <Text style={styles.label}>Font size</Text>
                    <Pressable accessibilityRole="button" onPress={() => setFontMenuOpen((open) => !open)} style={styles.select}>
                        <Text style={styles.inputText}>{configuration.font}</Text>
                        <Text style={styles.chevron}>{fontMenuOpen ? '^' : 'v'}</Text>
                    </Pressable>
                    {fontMenuOpen ? (
                        <View style={styles.menu}>
                            {fontOptions.map((font) => (
                                <Pressable key={font} onPress={() => { setConfiguration((current) => ({ ...current, font })); setFontMenuOpen(false); }} style={styles.menuOption}>
                                    <Text style={styles.inputText}>{font}</Text>
                                </Pressable>
                            ))}
                        </View>
                    ) : null}
                    <Text style={styles.label}>Text override</Text>
                    <TextInput accessibilityLabel="Text to use" onChangeText={(text) => setConfiguration((current) => ({ ...current, text }))} placeholder="Use brightness characters" placeholderTextColor="#8b8b84" style={styles.input} value={configuration.text} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tone and thresholds</Text>
                    <Text style={styles.label}>Map font to brightness</Text>
                    <Pressable accessibilityRole="button" onPress={() => setMapMenuOpen((open) => !open)} style={styles.select}>
                        <Text style={styles.inputText}>{configuration.map}</Text>
                        <Text style={styles.chevron}>{mapMenuOpen ? '^' : 'v'}</Text>
                    </Pressable>
                    {mapMenuOpen ? (
                        <View style={styles.menu}>
                            {mapOptions.map((map) => (
                                <Pressable key={map} onPress={() => { setConfiguration((current) => ({ ...current, map })); setMapMenuOpen(false); }} style={styles.menuOption}>
                                    <Text style={styles.inputText}>{map}</Text>
                                </Pressable>
                            ))}
                        </View>
                    ) : null}
                    <Text style={styles.label}>Inferior thresholds</Text>
                    <Pressable accessibilityRole="button" onPress={() => setInferiorMenuOpen((open) => !open)} style={styles.select}>
                        <Text style={styles.inputText}>{configuration.inferior}</Text>
                        <Text style={styles.chevron}>{inferiorMenuOpen ? '^' : 'v'}</Text>
                    </Pressable>
                    {inferiorMenuOpen ? (
                        <View style={styles.menu}>
                            {inferiorOptions.map((inferior) => (
                                <Pressable key={inferior} onPress={() => { setConfiguration((current) => ({ ...current, inferior })); setInferiorMenuOpen(false); }} style={styles.menuOption}>
                                    <Text style={styles.inputText}>{inferior}</Text>
                                </Pressable>
                            ))}
                        </View>
                    ) : null}
                    <NumberInput label="Increase brightness" value={configuration.lights} onChangeText={(value) => updateNumber('lights', value)} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Misc.</Text>
                    {([
                        ['blackWhite', 'Black and white'],
                        ['invertMap', 'Invert mapping'],
                    ] as const).map(([field, label]) => (
                        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: configuration[field] }} key={field} onPress={() => updateBoolean(field)} style={styles.checkboxRow}>
                            <View style={[styles.checkbox, configuration[field] && styles.checkboxChecked]}>
                                {configuration[field] ? <Text style={styles.checkmark}>x</Text> : null}
                            </View>
                            <Text style={styles.checkboxLabel}>{label}</Text>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
            <View style={styles.actions}>
                <Pressable accessibilityRole="button" onPress={handleCancel} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={handleApply} style={styles.applyButton}>
                    <Text style={styles.applyText}>Apply</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

type NumberInputProps = { label: string; value: number; onChangeText: (value: string) => void };

function NumberInput({ label, value, onChangeText }: NumberInputProps) {
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <TextInput accessibilityLabel={label} keyboardType="number-pad" onChangeText={onChangeText} style={styles.input} value={String(value)} />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { backgroundColor: '#f4f1e8', flex: 1 },
    header: { backgroundColor: '#14231f', paddingHorizontal: 24, paddingTop: 18, paddingBottom: 22 },
    eyebrow: { color: '#d6e068', fontSize: 12, fontWeight: '700', letterSpacing: 2 },
    title: { color: '#f4f1e8', fontSize: 34, fontWeight: '800', marginTop: 8 },
    subtitle: { color: '#b7c2b8', fontSize: 14, marginTop: 6 },
    content: { padding: 20, paddingBottom: 32 },
    section: { paddingVertical: 18 },
    sectionTitle: { color: '#14231f', fontSize: 17, fontWeight: '800', marginBottom: 10 },
    label: { color: '#50584e', fontSize: 12, fontWeight: '700', marginBottom: 6, marginTop: 10, textTransform: 'uppercase' },
    input: { backgroundColor: '#fffdf6', borderColor: '#b5b7a8', borderRadius: 4, borderWidth: 1, color: '#14231f', fontSize: 16, minHeight: 46, paddingHorizontal: 12 },
    select: { alignItems: 'center', backgroundColor: '#fffdf6', borderColor: '#b5b7a8', borderRadius: 4, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 46, paddingHorizontal: 12 },
    inputText: { color: '#14231f', fontSize: 16 },
    chevron: { color: '#14231f', fontSize: 18, fontWeight: '700' },
    menu: { backgroundColor: '#fffdf6', borderColor: '#b5b7a8', borderWidth: 1, marginTop: 4 },
    menuOption: { borderBottomColor: '#deded2', borderBottomWidth: StyleSheet.hairlineWidth, padding: 12 },
    checkboxRow: { alignItems: 'center', flexDirection: 'row', minHeight: 46 },
    checkbox: { alignItems: 'center', borderColor: '#14231f', borderRadius: 3, borderWidth: 1, height: 22, justifyContent: 'center', width: 22 },
    checkboxChecked: { backgroundColor: '#d6e068' },
    checkmark: { color: '#14231f', fontWeight: '800' },
    checkboxLabel: { color: '#14231f', fontSize: 15, marginLeft: 12 },
    actions: { backgroundColor: '#fffdf6', borderTopColor: '#c7c7b9', borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: 12, padding: 16 },
    cancelButton: { alignItems: 'center', borderColor: '#14231f', borderRadius: 4, borderWidth: 1, flex: 1, justifyContent: 'center', minHeight: 50 },
    cancelText: { color: '#14231f', fontSize: 16, fontWeight: '700' },
    applyButton: { alignItems: 'center', backgroundColor: '#d6e068', borderRadius: 4, flex: 1, justifyContent: 'center', minHeight: 50 },
    applyText: { color: '#14231f', fontSize: 16, fontWeight: '800' },
});