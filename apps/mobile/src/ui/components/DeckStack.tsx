import { useMemo, useRef, useState } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";
import { CardBack } from "./CardBack";
import { shadow } from "../theme/tokens";

type Props = {
  remaining: number;
  disabled?: boolean;
  onDrop(point: { pageX: number; pageY: number }): void;
};

export function DeckStack({ remaining, disabled, onDrop }: Props) {
  const drag = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [isDragging, setIsDragging] = useState(false);
  const canDrag = !disabled && remaining > 0;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => canDrag,
        onMoveShouldSetPanResponder: (_event, gesture) => canDrag && (Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3),
        onPanResponderGrant: () => {
          setIsDragging(true);
          drag.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event([null, { dx: drag.x, dy: drag.y }], {
          useNativeDriver: false
        }),
        onPanResponderRelease: (_event, gesture) => {
          setIsDragging(false);
          drag.setValue({ x: 0, y: 0 });

          if (Math.abs(gesture.dx) < 8 && Math.abs(gesture.dy) < 8) {
            return;
          }

          onDrop({ pageX: gesture.moveX, pageY: gesture.moveY });
        },
        onPanResponderTerminate: () => {
          setIsDragging(false);
          drag.setValue({ x: 0, y: 0 });
        }
      }),
    [canDrag, drag, onDrop]
  );

  return (
    <View
      accessibilityLabel={`Mazo con ${remaining} cartas`}
      style={styles.wrap}
      {...panResponder.panHandlers}
    >
      <View style={[styles.offset, styles.offsetTwo]}>
        <CardBack />
      </View>
      <View style={[styles.offset, styles.offsetOne]}>
        <CardBack />
      </View>
      <Animated.View
        style={[
          styles.card,
          {
            cursor: canDrag ? "pointer" : "auto",
            opacity: remaining === 0 ? 0.45 : 1,
            transform: [{ translateX: drag.x }, { translateY: drag.y }, { rotate: isDragging ? "-5deg" : "0deg" }, { scale: isDragging ? 1.04 : 1 }]
          }
        ]}
      >
        <CardBack />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 170,
    height: 240,
    alignItems: "center",
    justifyContent: "center"
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
    overflow: "hidden",
    ...shadow
  },
  offsetOne: {
    transform: [{ translateX: 5 }, { translateY: -5 }, { rotate: "2deg" }]
  },
  offsetTwo: {
    transform: [{ translateX: 10 }, { translateY: -10 }, { rotate: "4deg" }]
  }
});
