import BackButton from "@/components/Material/BackButton";
import Colors from "@/constants/Colors";
import FontSize from "@/constants/FontSize";
import Spacing from "@/constants/Spacing";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View style={styles.content}>
      <Text style={styles.text}>Not found</Text>
      <BackButton />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: Colors.background,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    fontFamily: "outfit-bold",
    fontSize: FontSize.large,
    marginBottom: Spacing,
  },
});
