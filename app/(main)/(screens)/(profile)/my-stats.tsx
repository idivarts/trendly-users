import React from "react";
import { Text, View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";
import { ScrollView, Dimensions, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import Colors from "@/constants/Colors";
import { Theme, useTheme } from "@react-navigation/native";
import { TopBrandCard } from "@/components/basic-profile/stats/TopBrand";
import {
  EARNING_TIMELINE_DATA as earningTimelineData,
  PIE_CHART_DATA as pieChartData,
} from "@/constants/Chart";

const MyStatsScreen = () => {
  const screenWidth = Dimensions.get("window").width;
  const theme = useTheme();
  const styles = cardStyle(theme);

  return (
    <AppLayout>
      <ScreenHeader
        title="My Stats"
        rightAction
        rightActionButton={
          //export button
          <Button
            mode="contained"
            onPress={() => {}}
            style={{
              backgroundColor: Colors(theme).primary,
            }}
          >
            Export
          </Button>
        }
      />


      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 16,
          backgroundColor: Colors(theme).background,
        }}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        {/* Top Stats Row */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <Card style={styles.cardStyle}>
            <Card.Content
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}
            >
              <Card.Title
                title="Total Earnings"
                titleStyle={{ fontSize: 16, fontWeight: "bold", width: "100%" }}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: Colors(theme).primary,
                  textAlign: "center",
                }}
              >
                ₹ 1,23,456
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.cardStyle}>
            <Card.Content
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}
            >
              <Card.Title
                title="Active Collabs"
                titleStyle={{ fontSize: 16, fontWeight: "bold" }}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: Colors(theme).primary,
                  textAlign: "center",
                }}
              >
                12
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Completed Collabs */}
        <Card
          style={{
            borderWidth: 0.2,
            borderRadius: 10,
            margin: 8,
            elevation: 3,
            backgroundColor: "#ffffff",
            alignSelf: "center",
            width: "80%",
          }}
        >
          <Card.Content
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
          >
            <Card.Title
              title="Completed Collabs"
              titleStyle={{
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: Colors(theme).primary,
                textAlign: "center",
              }}
            >
              15
            </Text>
          </Card.Content>
        </Card>

        <Card style={{ ...styles.cardStyle, marginVertical: 10 }}>
          <Card.Title title="Earning Timeline" />
          <Card.Content>
            <LineChart
              data={earningTimelineData}
              width={screenWidth - 1000}
              height={200}
              xAxisLabelTextStyle={{ fontSize: 10 }}
              yAxisTextStyle={{ fontSize: 10 }}
              isAnimated
            />
          </Card.Content>
        </Card>

        <Card style={{ ...styles.cardStyle, marginVertical: 10 }}>
          <Card.Title title="Most Active Categories" />
          <Card.Content
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <PieChart
              data={pieChartData}
              radius={60}
              labelsPosition={"onBorder"}
              textSize={10}
              labelLineConfig={{
                length: 10,
                color: "#000",
              }}
            />
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 10,
              }}
            >
              {pieChartData.map((data, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: data?.frontColor,
                      borderRadius: 5,
                      margin: 5,
                    }}
                  />
                  <Text style={{ fontSize: 14 }}>{data?.text}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginVertical: 10,
            textAlign: "center",
          }}
        >
          Top Brands You Have Worked With
        </Text>

        <TopBrandCard
          name="Brand A"
          numberOfCompletedCampaigns={25}
          rating={4}
        />
        <TopBrandCard
          name="Brand B"
          numberOfCompletedCampaigns={18}
          rating={4.3}
        />
        <TopBrandCard
          name="Brand C"
          numberOfCompletedCampaigns={15}
          rating={3.7}
        />
        <TopBrandCard
          name="Brand D"
          numberOfCompletedCampaigns={10}
          rating={3}
        />
      </ScrollView>
    </AppLayout>
  );
};

const cardStyle = (theme: Theme) =>
  StyleSheet.create({
    cardStyle: {
      borderWidth: 0.2,
      borderRadius: 10,
      margin: 8,
      flex: 1,
      elevation: 3,
      backgroundColor: Colors(theme).background,
    },
  });

export default MyStatsScreen;
