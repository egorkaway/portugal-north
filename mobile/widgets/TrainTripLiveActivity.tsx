import { Image, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, padding } from "@expo/ui/swift-ui/modifiers";
import { createLiveActivity, type LiveActivityEnvironment } from "expo-widgets";
import type { TripWidgetProps } from "@/lib/types";

const TrainTripLiveActivity = (props: TripWidgetProps, environment: LiveActivityEnvironment) => {
  "widget";

  const accent = environment.isLuminanceReduced ? "#FFFFFF" : "#012841";
  const muted = environment.isLuminanceReduced ? "#D0D8DE" : "#4A6274";

  return {
    banner: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ weight: "bold", size: 18 }), foregroundStyle(accent)]}>
          {props.headline}
        </Text>
        <Text modifiers={[font({ size: 14 }), foregroundStyle(muted)]}>{props.subline}</Text>
        {props.stationName ? (
          <Text modifiers={[font({ size: 13 }), foregroundStyle(muted)]}>{props.stationName}</Text>
        ) : null}
      </VStack>
    ),
    compactLeading: <Image systemName="tram.fill" color={accent} />,
    compactTrailing: (
      <Text modifiers={[font({ weight: "bold", size: 14 }), foregroundStyle(accent)]}>
        {props.headline}
      </Text>
    ),
    minimal: <Image systemName="tram.fill" color={accent} />,
    expandedLeading: (
      <VStack modifiers={[padding({ all: 8 })]}>
        <Image systemName="tram.fill" color={accent} />
        <Text modifiers={[font({ size: 11 }), foregroundStyle(muted)]}>Train</Text>
      </VStack>
    ),
    expandedTrailing: (
      <VStack modifiers={[padding({ all: 8 })]}>
        <Text modifiers={[font({ weight: "bold", size: 24 }), foregroundStyle(accent)]}>
          {props.headline}
        </Text>
        <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>
          {props.departureTime || "—"}
        </Text>
      </VStack>
    ),
    expandedBottom: (
      <VStack modifiers={[padding({ all: 8 })]}>
        <Text modifiers={[font({ size: 13 }), foregroundStyle(muted)]}>{props.subline}</Text>
        {props.platform ? (
          <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>Platform {props.platform}</Text>
        ) : null}
      </VStack>
    ),
  };
};

export default createLiveActivity("TrainTripLiveActivity", TrainTripLiveActivity);
