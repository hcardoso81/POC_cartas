import { Pressable, StyleSheet, View } from "react-native";
import { CardBack } from "./CardBack";
import { shadow } from "../theme/tokens";

type Props = {
  remaining: number;
  disabled?: boolean;
  onDraw(): void;
};

export function DeckStack({ remaining, disabled, onDraw }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Mazo con ${remaining} cartas`}
      disabled={disabled || remaining === 0}
      onPress={onDraw}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <View style={[styles.offset, styles.offsetTwo]} />
      <View style={[styles.offset, styles.offsetOne]} />
      <View style={styles.card}>
        <CardBack />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: 170,
    height: 240,
    alignItems: "center",
    justifyContent: "center"
  },
  pressed: {
    transform: [{ translateY: 2 }, { scale: 0.99 }]
  },
  card: {
    width: 156,
    height: 224,
    ...shadow
  },
  offset: {
    position: "absolute",
    width: 156,
    height: 224,
    borderRadius: 12,
    backgroundColor: "#EEE0BF"
  },
  offsetOne: {
    transform: [{ translateX: 5 }, { translateY: -5 }, { rotate: "2deg" }]
  },
  offsetTwo: {
    transform: [{ translateX: 10 }, { translateY: -10 }, { rotate: "4deg" }]
  }
});
