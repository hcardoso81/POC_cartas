import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, PanResponder, Pressable, StyleSheet } from "react-native";
import type { Card } from "../../core/domain/Card";
import { CardBack } from "./CardBack";
import { PlayingCard } from "./PlayingCard";

type Props = {
  card: Card;
  x: number;
  y: number;
  zIndex: number;
  onFocus(): void;
  onMove(position: { x: number; y: number }): void;
};

export function AnimatedDrawnCard({ card, x, y, zIndex, onFocus, onMove }: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const drag = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const flipProgress = useRef(new Animated.Value(0)).current;
  const lastPressAt = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFaceUp, setIsFaceUp] = useState(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) => Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3,
        onPanResponderGrant: () => {
          onFocus();
          setIsDragging(true);
          drag.extractOffset();
          drag.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event([null, { dx: drag.x, dy: drag.y }], {
          useNativeDriver: false
        }),
        onPanResponderRelease: (_event, gesture) => {
          drag.setValue({ x: 0, y: 0 });
          setIsDragging(false);
          onMove({ x: x + gesture.dx, y: y + gesture.dy });
        },
        onPanResponderTerminate: () => {
          drag.setValue({ x: 0, y: 0 });
          setIsDragging(false);
        }
      }),
    [drag, onFocus, onMove, x, y]
  );

  useEffect(() => {
    progress.setValue(0);
    flipProgress.setValue(0);
    drag.setValue({ x: 0, y: 0 });
    drag.setOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setIsFaceUp(false);

    Animated.spring(progress, {
      toValue: 1,
      friction: 8,
      tension: 65,
      useNativeDriver: true
    }).start();
  }, [card.id, drag, flipProgress, progress]);

  function handlePress() {
    const now = Date.now();

    if (now - lastPressAt.current > 320) {
      lastPressAt.current = now;
      return;
    }

    lastPressAt.current = 0;
    const nextFaceUp = !isFaceUp;

    setIsFaceUp(nextFaceUp);
    Animated.spring(flipProgress, {
      toValue: nextFaceUp ? 1 : 0,
      friction: 8,
      tension: 65,
      useNativeDriver: true
    }).start();
  }

  const entranceTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-48, 0]
  });

  const entranceTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 0]
  });

  const frontRotateY = flipProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["180deg", "90deg", "0deg"]
  });

  const backRotateY = flipProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["0deg", "90deg", "180deg"]
  });

  const frontOpacity = flipProgress.interpolate({
    inputRange: [0, 0.48, 0.52, 1],
    outputRange: [0, 0, 1, 1]
  });

  const backOpacity = flipProgress.interpolate({
    inputRange: [0, 0.48, 0.52, 1],
    outputRange: [1, 1, 0, 0]
  });

  const dragScale = isDragging ? 1.04 : 1;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.wrap,
        {
          left: x,
          top: y,
          zIndex,
          transform: [
            { translateX: Animated.add(entranceTranslateX, drag.x) },
            { translateY: Animated.add(entranceTranslateY, drag.y) },
            { scale: dragScale }
          ]
        }
      ]}
    >
      <Pressable onPress={handlePress} onPressIn={onFocus} style={styles.pressable}>
        <Animated.View style={[styles.side, { opacity: backOpacity, transform: [{ rotateY: backRotateY }] }]}>
          <CardBack />
        </Animated.View>
        <Animated.View style={[styles.side, { opacity: frontOpacity, transform: [{ rotateY: frontRotateY }] }]}>
          <PlayingCard card={card} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    width: 156,
    height: 224
  },
  pressable: {
    flex: 1
  },
  side: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: "hidden"
  }
});
