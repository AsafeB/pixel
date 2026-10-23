
import { StatusBar } from "expo-status-bar";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import {
  Alert,
  Button,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";

export default function App() {
  const { width } = useWindowDimensions();

  const tamanhoGrade = Math.min(width - 32, 400);
  const tamanhoPixel = (tamanhoGrade - 2) / 8;
  const tamanhoCor = Math.max(
    24,
    Math.min(48, Math.floor((width - 32) / 6 - 8))
  );

  const cores = [
    "#FFFFFF",
    "#FFE135",
    "#FF8C00",
    "#E32636",
    "#FF69B4",
    "#8A2BE2",
    "#1F3FBF",
    "#4FB3E8",
    "#1E8B3A",
    "#7FD13B",
    "#8B4513",
    "#000000",
    "#00BFA6",
    "#00BCD4", 
    "#6A5ACD",
    "#C71585",
    "#F4A261",
    "#808080",
  ];

  const [corSelecionada, setCorSelecionada] =
    useState<string>("#000000");

  const [pixels, setPixels] = useState<string[]>(
    Array(64).fill("#20202A")
  );

  const gradeRef = useRef<View>(null);

  function pintarPixel(index: number) {
    const novosPixels = [...pixels];
    novosPixels[index] = corSelecionada;
    setPixels(novosPixels);
  }

  function limpar() {
  setPixels(Array(64).fill("#20202A"));
}

  async function compartilhar() {
    try {
      if (!gradeRef.current) {
        Alert.alert("Erro", "A grade ainda não está pronta.");
        return;
      }

      const uri = await captureRef(gradeRef, {
        format: "png",
        quality: 1,
        result: Platform.OS === "web" ? "data-uri" : "tmpfile",
      });

      // No navegador, baixa o desenho como arquivo PNG.
      if (Platform.OS === "web") {
        const link = document.createElement("a");
        link.href = uri;
        link.download = "pixel-art.png";
        link.click();
        return;
      }

      const disponivel = await Sharing.isAvailableAsync();

      if (!disponivel) {
        Alert.alert(
          "Indisponível",
          "O compartilhamento não está disponível neste dispositivo."
        );
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Compartilhar desenho",
        UTI: "public.png",
      });
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível exportar o desenho. Tente novamente."
      );
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.topo}>
        <Text style={styles.titulo}>Pixel</Text>

        <Text style={styles.instrucao}>
          Escolha uma cor e comece a desenhar
        </Text>

        <View style={styles.paleta}>
          {cores.map((cor) => (
            <TouchableOpacity
              key={cor}
              onPress={() => setCorSelecionada(cor)}
              style={{
                width: tamanhoCor,
                height: tamanhoCor,
                margin: 4,
                backgroundColor: cor,
                borderWidth: cor === corSelecionada ? 3 : 1,
                borderColor:
                  cor === "#FFFFFF" ? "#777777" : "#222222",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color:
                    [
                      "#000000",
                      "#1F3FBF",
                      "#8A2BE2",
                      "#1E8B3A",
                      "#8B4513",
                    ].includes(cor)
                      ? "#FFFFFF"
                      : "#000000",
                }}
              >
                {cor === corSelecionada ? "✓" : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.areaGrade}>
        <View
          ref={gradeRef}
          collapsable={false}
          style={[
            styles.grade,
            {
              width: tamanhoGrade,
              height: tamanhoGrade,
            },
          ]}
        >
          {pixels.map((cor, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => pintarPixel(index)}
              accessibilityLabel={`Pintar pixel ${index + 1}`}
              style={{
                width: tamanhoPixel,
                height: tamanhoPixel,
                backgroundColor: cor,
                borderWidth: 0.5,
                borderColor: "#999999",
              }}
            />
          ))}
        </View>
      </View>

      <View style={styles.botoes}>
        <View style={styles.botao}>
          <Button title="Limpar" onPress={limpar} />
        </View>

        <View style={styles.botao}>
          <Button title="Exportar PNG" onPress={compartilhar} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121218",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  topo: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  titulo: {
  fontSize: 30,
  fontWeight: "bold",
  color: "#F4F4F5",
  marginBottom: 4,
  },
  instrucao: {
    fontSize: 14,
    color: "#A1A1AA",
    marginBottom: 8,
    textAlign: "center",
  },
  paleta: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  areaGrade: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "#333333",
  },
  botoes: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  botao: {
    flex: 1,
    marginHorizontal: 4,
  },
});
