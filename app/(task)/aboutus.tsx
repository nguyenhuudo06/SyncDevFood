import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import React from "react";
import HeaderPage from "@/components/HeaderPage/HeaderPage";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import FontSize from "@/constants/FontSize";
import MapView, { Marker } from "react-native-maps";

const AboutUs = () => {
  const listContent = [
    "Delicious & Healthy Foods",
    "Spacific Family & Kids Zone",
    "Best Price & Offers",
    "Music & Other Facilities",
    "Made By Fresh Ingredients",
  ];

  return (
    <ScrollView style={styles.content}>
      <HeaderPage titlePage="About us" />
      <View style={{ padding: Spacing, flex: 1 }}>
        <View style={{ marginBottom: Spacing }}>
          <Image
            source={require("../../assets/images/about_chef.jpg")}
            style={{
              width: "100%",
              height: 200,
              borderRadius: Spacing * 0.8,
            }}
            resizeMode="cover"
          />
        </View>

        <View style={{ marginBottom: Spacing }}>
          <Text style={[styles.outFitMedium]}>Healthy Foods Provider</Text>
        </View>

        <View style={{ marginBottom: Spacing }}>
          <Text style={[styles.outFitRegular]}>
            Our online food ordering service offers a convenient and seamless
            way to satisfy your cravings. Browse a wide range of restaurants and
            cuisines from the comfort of your home, office, or anywhere. Enjoy
            user-friendly features like personalized recommendations, real-time
            order tracking, secure payment options, and timely delivery. Whether
            it's a quick snack, a family meal, or a late-night craving, we bring
            your favorite dishes straight to your door with just a few clicks.
            Effortless, reliable, and delicious—order now!
          </Text>
        </View>

        <View style={{ marginBottom: Spacing }}>
          {listContent.map((item) => (
            <View>
              <View style={[styles.flexStart]}>
                <View>
                  <AntDesign name="checkcircle" style={[styles.icon]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.outFitRegular]}>{item}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

      </View>
    </ScrollView>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 200,
    borderRadius: Spacing * 0.8,
  },
  map: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flexStart: {
    flexDirection: "row",
    gap: Spacing,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  icon: {
    fontSize: Spacing * 2,
    color: Colors.primary,
    padding: Spacing * 0.6,
  },
  outFitRegular: {
    fontFamily: "outfit-regular",
    fontSize: FontSize.medium,
  },
  outFitMedium: {
    fontFamily: "outfit-medium",
    fontSize: FontSize.large,
  },
});
