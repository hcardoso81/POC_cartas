import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import type { Card } from "../../core/domain/Card";
import { CardBack } from "./CardBack";
import { PlayingCard } from "./PlayingCard";

type Props = {
  card: Card;
};

export function AnimatedDrawnCard({ card }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.spring(progress, {
      toValue: 1,
      friction: 8,
      tension: 65,
      useNativeDriver: true
    }).start();
  }, [card.id, progress]);

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

  return (
    <Animated.View style={[styles.wrap, { transform: [{ translateX }, { rotateY }] }]}>
      <Animated.View style={[styles.side, { opacity: backOpacity }]}>
        <CardBack />
      </Animated.View>
      <Animated.View style={[styles.side, { opacity: frontOpacity }]}>
        <PlayingCard card={card} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 156,
    height: 224
  },
  side: {
    ...StyleSheet.absoluteFillObject,
    backfaceVisibility: "hidden"
  }
});
