import { TopBrandCard } from "@/components/basic-profile/stats/TopBrand";
import { Text, View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";
import Colors from "@/shared-uis/constants/Colors";
import { Theme, useTheme } from "@react-navigation/native";
import React from "react";
import { Dimensions, Platform, ScrollView, StyleSheet } from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";
import { Card } from "react-native-paper";
//@ts-ignore
import FunnelChart from "react-native-funnel-chart";

import FunnelChartWeb from "@/components/basic-profile/stats/funnel-chart/FunnelChart";
import Button from "@/components/ui/button";
import {
  FUNNEL_DATA as demo_data,
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
            onPress={() => { }}
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

        {Platform.OS !== "web" ? (
          <Card
            style={{
              borderWidth: 0.2,
              borderRadius: 10,
              margin: 8,
              flex: 1,
              elevation: 3,
              backgroundColor: Colors(theme).background,
              marginVertical: 10,
            }}
          >
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
        ) : (
          <Card
            style={{
              borderWidth: 0.2,
              borderRadius: 10,
              margin: 8,
              flex: 1,
              elevation: 3,
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 30,
              backgroundColor: Colors(theme).background,
              marginVertical: 10,
            }}
          >
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
        )}

        <Card
          style={{
            borderWidth: 0.2,
            borderRadius: 10,
            margin: 8,
            paddingBottom: 30,
            flex: 1,
            elevation: 3,
            backgroundColor: Colors(theme).background,
            marginVertical: 10,
          }}
        >
          <Card.Title title="Application Overview" />
          <Card.Content>
            {Platform.OS === "web" ? (
              <FunnelChartWeb
                dataPoints={[
                  { label: "100 Campaigns Applied", y: 100 },
                  { label: "55 Applications Accepted", y: 55 },
                  { label: "50 Contracts Created", y: 50 },
                  { label: "30 Successful Completions", y: 30 },
                ]}
              />
            ) : (
              <FunnelChart
                animated
                data={demo_data}
                backgroundColor={Colors(theme).background}
                height={200}
                lineColor={"#fff"}
                space={3}
                fontSize={12}
                textColor={Colors(theme).text}
              />
            )}
          </Card.Content>
        </Card>

        <Card style={{ ...styles.cardStyle, marginVertical: 10 }}>
          <Card.Title title="Most Active Categories" />
          <Card.Content
            style={{
              alignItems: "center",
              justifyContent: "center",
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
