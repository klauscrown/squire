import { Alert, Linking } from 'react-native';

export interface PickedImage {
  uri: string;
  mimeType: string | null;
}

async function loadImagePicker() {
  try {
    return await import('expo-image-picker');
  } catch {
    throw new Error(
      'Galeria indisponível neste build. Rode `npm run android` para incluir o expo-image-picker.',
    );
  }
}

async function ensureLibraryPermission(
  ImagePicker: Awaited<ReturnType<typeof loadImagePicker>>,
): Promise<boolean> {
  const current = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (current.granted) return true;

  const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (requested.granted) return true;

  Alert.alert(
    'Permissão necessária',
    'Para importar retratos, permita o acesso à galeria nas configurações do dispositivo.',
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Abrir configurações', onPress: () => Linking.openSettings() },
    ],
  );
  return false;
}

/** Abre a galeria e devolve a imagem escolhida (ou null se cancelar). */
export async function pickImageFromLibrary(): Promise<PickedImage | null> {
  const ImagePicker = await loadImagePicker();
  const ok = await ensureLibraryPermission(ImagePicker);
  if (!ok) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [16, 9],
    quality: 0.85,
  });

  if (result.canceled || !result.assets[0]) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    mimeType: asset.mimeType ?? null,
  };
}
