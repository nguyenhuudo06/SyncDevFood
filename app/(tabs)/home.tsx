import { View, Text, Dimensions } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import Category from "../../components/Home/Category";
import { StyleSheet, SafeAreaView, ScrollView, StatusBar } from "react-native";
import Spacing from "@/constants/Spacing";
import { TouchableOpacity } from "react-native-gesture-handler";
import ProductList from "@/components/Product/ProductList";
import FontSize from "@/constants/FontSize";

const Home = () => {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={{ backgroundColor: "#ffffff", display: "flex" }}>
        {/* Header */}
        <Header /> 
        {/* Slider */}
        <View> 
          <Text style={styles.title}>Offers</Text>
        </View>
        <Slider />
        {/* Category */}
        <Category />
        {/* Products */}
        <ProductList />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: FontSize.medium,
    paddingHorizontal: Spacing,
    marginBottom: Spacing,
  },
});

export default Home;
