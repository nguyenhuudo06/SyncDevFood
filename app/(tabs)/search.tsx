import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Spacing from "@/constants/Spacing";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import ProductList from "@/components/Product/ProductList";

const Search = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <View style={styles.content}>
      <View style={{ padding: Spacing }}>
        <TouchableOpacity onPress={() => router.push(`../../(tabs)/search`)}>
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
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
