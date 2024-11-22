import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import Spacing from "@/constants/Spacing";
import { router } from "expo-router";
import { AntDesign, Entypo } from "@expo/vector-icons";
import FontSize from "@/constants/FontSize";

const BackButton = () => {
  return (
    <View
      style={{
        paddingHorizontal: Spacing,
        paddingVertical: Spacing * 0.4,
      }}
    >
      <TouchableOpacity
        style={[
          {
            width: 45,
            height: 45,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.primary_10,
            borderRadius: Spacing * 0.8,
            zIndex: 10,
          },
        ]}
        onPress={() => router.back()}
      >
        <Entypo
          name="chevron-left"
          size={FontSize.xLarge}
          color={Colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;
