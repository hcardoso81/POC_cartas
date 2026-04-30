import { View, StyleSheet } from "react-native";
import { colors } from "../theme/tokens";

export function CardBack() {
  return (
    <View style={styles.back}>
      <View style={styles.inner}>
        {Array.from({ length: 6 }).map((_, row) => (
          <View key={row} style={styles.row}>
            {Array.from({ length: 4 }).map((__, column) => (
              <View key={`${row}-${column}`} style={styles.diamond} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.blue,
    borderWidth: 6,
    borderColor: "#F7E7BD",
    padding: 8
  },
  inner: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#F7E7BD",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  row: {
    flexDirection: "row",
    gap: 16
  },
  diamond: {
    width: 10,
    height: 10,
    backgroundColor: "#C5323B",
    transform: [{ rotate: "45deg" }],
    borderWidth: 1,
    borderColor: "#F7E7BD"
  }
});
