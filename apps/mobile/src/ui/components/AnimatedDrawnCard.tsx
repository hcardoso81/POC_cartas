import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, PanResponder, StyleSheet } from "react-native";
import type { Card } from "../../core/domain/Card";
import type { CardFaceDesignId } from "../card-designs/cardFaceDesigns";
import { CardBack, type CardBackColor } from "./CardBack";
import { PlayingCard } from "./PlayingCard";

type Props = {
  card: Card;
  backColor: CardBackColor;
  faceDesign: CardFaceDesignId;
  x: number;
  y: number;
  zIndex: number;
  onFocus(): void;
  onMove(position: { x: number; y: number }): void;
};

export function AnimatedDrawnCard({ card, backColor, faceDesign, x, y, zIndex, onFocus, onMove }: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const drag = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const flipProgress = useRef(new Animated.Value(0)).current;
  const lastPressAt = useRef(0);
  const hasDragged = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFaceUp, setIsFaceUp] = useState(false);

  function toggleFace() {
    const nextFaceUp = !isFaceUp;

    setIsFaceUp(nextFaceUp);
    Animated.spring(flipProgress, {
      toValue: nextFaceUp ? 1 : 0,
      friction: 8,
      tension: 65,
      useNativeDriver: true
    }).start();
  }

  function handleTap() {
    const now = Date.now();

    if (now - lastPressAt.current > 360) {
      lastPressAt.current = now;
      return;
    }

    lastPressAt.current = 0;
    toggleFace();
  }

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          onFocus();
          hasDragged.current = false;
          setIsDragging(false);
          drag.extractOffset();
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
          const movedEnough = hasDragged.current || Math.abs(gesture.dx) > 6 || Math.abs(gesture.dy) > 6;

          drag.setValue({ x: 0, y: 0 });
          setIsDragging(false);

          if (movedEnough) {
            onMove({ x: x + gesture.dx, y: y + gesture.dy });
            return;
          }

          handleTap();
        },
        onPanResponderTerminate: () => {
          drag.setValue({ x: 0, y: 0 });
          setIsDragging(false);
        }
      }),
    [drag, handleTap, onFocus, onMove, x, y]
  );

  useEffect(() => {
    progress.setValue(0);
    flipProgress.setValue(0);
    drag.setValue({ x: 0, y: 0 });
    drag.setOffset({ x: 0, y: 0 });
    hasDragged.current = false;
    setIsDragging(false);
    setIsFaceUp(false);

    Animated.spring(progress, {
      toValue: 1,
      friction: 8,
      tension: 65,
      useNativeDriver: true
    }).start();
  }, [card.id, drag, flipProgress, progress]);

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
      <Animated.View style={[styles.side, { opacity: backOpacity, transform: [{ rotateY: backRotateY }] }]}>
        <CardBack color={backColor} />
      </Animated.View>
      <Animated.View style={[styles.side, { opacity: frontOpacity, transform: [{ rotateY: frontRotateY }] }]}>
        <PlayingCard card={card} faceDesign={faceDesign} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    width: 156,
    height: 224
  },
  side: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: "hidden"
  }
});
