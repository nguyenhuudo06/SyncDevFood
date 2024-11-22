import { View, Text, StatusBar, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import HeaderPage from "@/components/HeaderPage/HeaderPage";
import Spacing from "@/constants/Spacing";

const Wishlist = () => {
  return (
    <ScrollView style={styles.scrollView}>
      <HeaderPage titlePage="Wishlist" />
      <View style={{ padding: Spacing }}>Content</View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
});

export default Wishlist;
