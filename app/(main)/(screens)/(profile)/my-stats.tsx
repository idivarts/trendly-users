import React from "react";
import { Text, View } from "@/components/theme/Themed";
import ScreenHeader from "@/components/ui/screen-header";
import AppLayout from "@/layouts/app-layout";
import { ScrollView, Dimensions } from "react-native";
import { Card } from "react-native-paper";
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import Colors from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { TopBrandCard } from "@/components/basic-profile/stats/TopBrand";

const MyStatsScreen = () => {
  const screenWidth = Dimensions.get("window").width;
  const theme = useTheme();

  const cardStyle = {
    borderWidth: 0.2,
    borderRadius: 10,
    margin: 8,
    flex: 1,
    elevation: 3,
    backgroundColor: "#ffffff",
  };

  const funnelData = [
    { step: "Campaign Applied", value: 100 },
    { step: "Application Accepted", value: 80 },
    { step: "Contract Created", value: 50 },
    { step: "Successful Completion", value: 30 },
  ];

  const earningTimelineData = [
    { value: 1000, label: "Jan 1" },
    { value: 1500, label: "Jan 2" },
    { value: 2000, label: "Jan 3" },
    { value: 2500, label: "Jan 4" },
    { value: 3000, label: "Jan 5" },
    { value: 3500, label: "Jan 6" },
    { value: 4000, label: "Jan 7" },
  ];

  const pieChartData = [
    { value: 20, text: "Photography", frontColor: "#4caf50" },
    { value: 30, text: "Videography", frontColor: "#2196f3" },
    { value: 10, text: "Content Writing", frontColor: "#ff9800" },
    { value: 40, text: "Graphic Design", frontColor: "#e91e63" },
  ];

  const topBrandsData = [
    { value: 25, label: "Brand A", frontColor: "#4caf50" },
    { value: 18, label: "Brand B", frontColor: "#2196f3" },
    { value: 15, label: "Brand C", frontColor: "#ff9800" },
    { value: 10, label: "Brand D", frontColor: "#e91e63" },
  ];

  const renderLegend = (data: any) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
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
        <Text style={{ fontSize: 10 }}>{data?.label}</Text>
      </View>
    );
  };

  return (
    <AppLayout>
      <ScreenHeader title="My Stats" />

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
          <Card style={cardStyle}>
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

          <Card style={cardStyle}>
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

        <Card style={{ ...cardStyle, marginVertical: 10 }}>
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

        <Card style={{ ...cardStyle, marginVertical: 10 }}>
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

export default MyStatsScreen;
