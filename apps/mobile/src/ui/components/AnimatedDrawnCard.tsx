import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import type { Card } from "../../core/domain/Card";
import { colors } from "../theme/tokens";
import { CardBack } from "./CardBack";
import { PlayingCard } from "./PlayingCard";

type Props = {
  card: Card;
};

export function AnimatedDrawnCard({ card }: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const drag = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const faceDownProgress = useRef(new Animated.Value(0)).current;
  const lastPressAt = useRef(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFaceDown, setIsFaceDown] = useState(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) => Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3,
        onPanResponderGrant: () => {
          setIsDragging(true);
          drag.extractOffset();
          drag.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event([null, { dx: drag.x, dy: drag.y }], {
          useNativeDriver: false
        }),
        onPanResponderRelease: () => {
          drag.flattenOffset();
          setIsDragging(false);
        },
        onPanResponderTerminate: () => {
          drag.flattenOffset();
          setIsDragging(false);
        }
      }),
    [drag]
  );

  useEffect(() => {
    progress.setValue(0);
    faceDownProgress.setValue(0);
    drag.setValue({ x: 0, y: 0 });
    drag.setOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setIsHovering(false);
    setIsFaceDown(false);

    Animated.spring(progress, {
      toValue: 1,
      friction: 8,
      tension: 65,
      useNativeDriver: true
    }).start();
  }, [card.id, drag, faceDownProgress, progress]);

  function handlePress() {
    const now = Date.now();

    if (now - lastPressAt.current > 320) {
      lastPressAt.current = now;
      return;
    }

    lastPressAt.current = 0;
    const nextFaceDown = !isFaceDown;

    setIsFaceDown(nextFaceDown);
    Animated.spring(faceDownProgress, {
      toValue: nextFaceDown ? 1 : 0,
      friction: 8,
      tension: 65,
      useNativeDriver: true
    }).start();
  }

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-86, 0]
  });

  const rotateY = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["180deg", "90deg", "0deg"]
  });

  const frontOpacity = progress.interpolate({
    inputRange: [0, 0.48, 0.52, 1],
    outputRange: [0, 0, 1, 1]
  });

  const backOpacity = progress.interpolate({
    inputRange: [0, 0.48, 0.52, 1],
    outputRange: [1, 1, 0, 0]
  });

  const faceDownRotateY = faceDownProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["0deg", "90deg", "180deg"]
  });

  const faceDownBackRotateY = faceDownProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["180deg", "90deg", "0deg"]
  });

  const revealedFrontOpacity = Animated.multiply(
    frontOpacity,
    faceDownProgress.interpolate({
      inputRange: [0, 0.48, 0.52, 1],
      outputRange: [1, 1, 0, 0]
    })
  );

  const revealedBackOpacity = Animated.multiply(
    frontOpacity,
    faceDownProgress.interpolate({
      inputRange: [0, 0.48, 0.52, 1],
      outputRange: [0, 0, 1, 1]
    })
  );

  const dragHintVisible = (isHovering || isDragging) && !isFaceDown;
  const dragScale = isDragging ? 1.04 : 1;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.wrap,
        {
          transform: [
            { translateX: Animated.add(translateX, drag.x) },
            { translateY: drag.y },
            { rotateY },
            { scale: dragScale }
          ]
        }
      ]}
    >
      <Pressable
        onHoverIn={() => setIsHovering(true)}
        onHoverOut={() => setIsHovering(false)}
        onPress={handlePress}
        style={styles.pressable}
      >
        <Animated.View style={[styles.side, { opacity: backOpacity }]}>
          <CardBack />
        </Animated.View>
        <Animated.View style={[styles.side, { opacity: revealedFrontOpacity, transform: [{ rotateY: faceDownRotateY }] }]}>
          <PlayingCard card={card} />
        </Animated.View>
        <Animated.View style={[styles.side, { opacity: revealedBackOpacity, transform: [{ rotateY: faceDownBackRotateY }] }]}>
          <CardBack />
        </Animated.View>

        {dragHintVisible ? (
          <View pointerEvents="none" style={styles.dragTooltip}>
            <Text style={styles.dragTooltipText}>Press para mover</Text>
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 156,
    height: 224,
    zIndex: 4
  },
  pressable: {
    flex: 1
  },
  side: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: "hidden"
  },
  dragTooltip: {
    position: "absolute",
    top: -42,
    left: 12,
    right: 12,
    height: 30,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#071421",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5
  },
  dragTooltipText: {
    color: colors.ink,
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    lineHeight: 16
  }
});
