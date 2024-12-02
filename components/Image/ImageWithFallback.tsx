import Colors from "@/constants/Colors";
import Spacing from "@/constants/Spacing";
import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";

const ImageWithFallback = ({ source, fallbackSource, style, resizeMode }) => {
  const [isError, setIsError] = useState(false);

  return (
    <View style={[{ overflow: "hidden" }, style]}>
      <Image
        source={isError ? fallbackSource : source}
        style={styles.image}
        onError={() => setIsError(true)}
        resizeMode={resizeMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.primary_10
  },
});

export default ImageWithFallback;
