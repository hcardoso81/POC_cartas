import { useMemo, useRef, useState } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";
import { CardBack, type CardBackColor } from "./CardBack";
import { shadow } from "../theme/tokens";

type Props = {
  remaining: number;
  backColor: CardBackColor;
  disabled?: boolean;
  onDrop(point: { pageX: number; pageY: number }): void;
};

export function DeckStack({ remaining, backColor, disabled, onDrop }: Props) {
  const drag = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const hasDragged = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const canDrag = !disabled && remaining > 0;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => canDrag,
        onMoveShouldSetPanResponder: () => canDrag,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          hasDragged.current = false;
          setIsDragging(false);
          drag.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (_event, gesture) => {
          const movedEnough = Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4;

          if (movedEnough) {
            hasDragged.current = true;
            setIsDragging(true);
            drag.setValue({ x: gesture.dx, y: gesture.dy });
          }
        },
        onPanResponderRelease: (_event, gesture) => {
          const movedEnough = hasDragged.current || Math.abs(gesture.dx) > 8 || Math.abs(gesture.dy) > 8;

          setIsDragging(false);
          drag.setValue({ x: 0, y: 0 });

          if (!movedEnough) {
            return;
          }

          onDrop({ pageX: gesture.moveX, pageY: gesture.moveY });
        },
        onPanResponderTerminate: () => {
          setIsDragging(false);
          hasDragged.current = false;
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
        <CardBack color={backColor} />
      </View>
      <View style={[styles.offset, styles.offsetOne]}>
        <CardBack color={backColor} />
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
        <CardBack color={backColor} />
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
