import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import Spacing from "@/constants/Spacing";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const Header = () => {
  return (
    <View>
      <View>
        <ImageBackground
          source={require("../../assets/images/Pattern.png")}
          style={{ width: "100%", padding: 20 }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => router.push("../(tabs)/profile")}
                >
                  <Image
                    style={{
                      width: Spacing * 4.5,
                      height: Spacing * 4.5,
                      borderRadius: Spacing * 3,
                      marginRight: Spacing,
                    }}
                    source={require("../../assets/images/avatart-template.jpg")}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity style={{ marginRight: Spacing }}>
                  <Ionicons
                    name="notifications-outline"
                    size={Spacing * 3.5}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons
                    name="menu"
                    size={Spacing * 3.5}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: 15 }}>
              <LinearGradient
                colors={["#FFF0F0", "#F76D02B5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                  marginVertical: 10,
                  borderRadius: Spacing,
                }}
              >
                <Ionicons name="search" size={24} color={Colors.text} />
                <TextInput
                  placeholder="Search"
                  style={{
                    fontSize: 16,
                    fontFamily: "outfit-regular",
                    flex: 1,
                    borderWidth: 0,
                    color: Colors.text,
                    paddingLeft: 10,
                  }}
                />
              </LinearGradient>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default Header;
