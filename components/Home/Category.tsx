import { View, Text } from "react-native";
import React from "react";
import CategoryItem from "./CategoryItem";
import TabContent from "./TabContent";
import FontSize from "@/constants/FontSize";
import Spacing from "@/constants/Spacing";

const Category = () => {
  return (
    <View style={{ paddingHorizontal: Spacing }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: FontSize.medium,
            fontFamily: "outfit-bold",
            width: "100%"
          }}
        >
          Explore
        </Text>
      </View>
      <TabContent />
    </View>
  );
};

export default Category;
