import { View, Text } from "react-native";
import React from "react";
import Spacing from "@/constants/Spacing";
import BackButton from "../Material/BackButton";
import FontSize from "@/constants/FontSize";

interface HeaderPageProps {
  titlePage: string;
}

const HeaderPage: React.FC<HeaderPageProps> = ({ titlePage }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: Spacing,
      }}
    >
      <BackButton />
      <View style={{ flex: 1, alignSelf: "center" }}>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: FontSize.large,
            marginLeft: Spacing,
          }}
        >
          {titlePage}
        </Text>
      </View>
    </View>
  );
};

export default HeaderPage;
