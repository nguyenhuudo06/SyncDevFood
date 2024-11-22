import { View, Text, Dimensions } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import Category from "../../components/Home/Category";
import { StyleSheet, SafeAreaView, ScrollView, StatusBar } from "react-native";
import Spacing from "@/constants/Spacing";
import { TouchableOpacity } from "react-native-gesture-handler";
import ProductList from "@/components/Product/ProductList";

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={{ backgroundColor: "#ffffff", display: "flex", flex: 1 }}>
          {/* Header */}
          <Header />
          {/* Slider */}
          <Slider />
          {/* Category */}
          <Category />
          {/* Products */}
          <ProductList />
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: "#fff",
  },
});

export default Home;

