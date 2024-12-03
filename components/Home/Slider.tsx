import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import Spacing from "@/constants/Spacing";
import FontSize from "@/constants/FontSize";
import { callGetAllOffers } from "@/services/api-call";
import { router } from "expo-router";
import Colors from "@/constants/Colors";

const Slider = () => {
  const sliderList = [
    "https://resourceboy.com/wp-content/uploads/2022/04/front-view-of-a-horizontal-banner-mockup.jpg",
    "https://resourceboy.com/wp-content/uploads/2022/04/front-view-of-a-horizontal-banner-mockup.jpg",
    "https://resourceboy.com/wp-content/uploads/2022/04/front-view-of-a-horizontal-banner-mockup.jpg",
  ];

  const [offerData, setOfferData] = useState([]);
  console.log(offerData);

  const fetchData = async () => {
    try {
      const response = await callGetAllOffers();
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status " + response.status);
      }

      const dataProcessing = response?.data?._embedded?.offerResponseList ?? [];

      setOfferData(dataProcessing);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      {offerData && offerData.length > 0 ? (
        <FlatList
          data={offerData}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push(`../(product)/product/${item.dish.dishId}`)
              }
            >
              <View>
                <Image
                  source={{ uri: item.dish.thumbImage }}
                  style={styles.image}
                />
                <View
                  style={{
                    position: "absolute",
                    top: Spacing,
                    right: Spacing * 2,
                    padding: Spacing * 0.6,
                    borderRadius: Spacing * 0.8,
                    backgroundColor: Colors.white,
                    paddingHorizontal: Spacing
                  }}
                >
                  <Text style={{ fontFamily: "outfit-medium", color: Colors.primary, fontSize: FontSize.medium }}>- {item.discountPercentage} %</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.sliderContainer}
        />
      ) : (
        <FlatList
          data={sliderList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.sliderContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: "outfit-bold",
    fontSize: FontSize.medium,
    padding: Spacing * 2,
    paddingBottom: 5,
  },
  sliderContainer: {
    paddingHorizontal: Spacing,
  },
  image: {
    width: Dimensions.get("window").width - Spacing * 3,
    height: 160,
    marginRight: 10,
    resizeMode: "cover",
    borderRadius: 10,
  },
});

export default Slider;
