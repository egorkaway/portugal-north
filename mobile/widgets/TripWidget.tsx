import { Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, padding } from "@expo/ui/swift-ui/modifiers";
import { createWidget, type WidgetEnvironment } from "expo-widgets";
import type { TripWidgetProps } from "@/lib/types";

const TripWidget = (props: TripWidgetProps, environment: WidgetEnvironment) => {
  "widget";

  const accent = environment.colorScheme === "dark" ? "#7EC8E3" : "#012841";
  const muted = environment.colorScheme === "dark" ? "#B8C5CE" : "#4A6274";

  if (environment.widgetFamily === "systemSmall") {
    return (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ weight: "bold", size: 22 }), foregroundStyle(accent)]}>
          {props.headline}
        </Text>
        <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>{props.subline}</Text>
      </VStack>
    );
  }

  return (
    <VStack modifiers={[padding({ all: 14 })]}>
      <Text modifiers={[font({ weight: "bold", size: 24 }), foregroundStyle(accent)]}>
        {props.headline}
      </Text>
      <Text modifiers={[font({ size: 14 }), foregroundStyle(muted)]}>{props.subline}</Text>
      {props.mode === "active" && props.stationName ? (
        <Text modifiers={[font({ size: 13 }), foregroundStyle(muted)]}>
          {props.stationName}
          {props.platform ? ` · Platform ${props.platform}` : ""}
        </Text>
      ) : null}
      {props.mode === "lastTaken" ? (
        <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>Last train taken</Text>
      ) : null}
      {props.mode === "nearest" ? (
        <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>Open app to browse</Text>
      ) : null}
    </VStack>
  );
};

export default createWidget("TripWidget", TripWidget);
