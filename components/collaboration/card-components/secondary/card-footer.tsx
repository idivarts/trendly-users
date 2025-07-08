import { Text, View } from "@/components/theme/Themed";
import React from "react";
import { StyleSheet } from "react-native";

type CardFooterProps = {
  quote: string;
  timeline: string;
};

export const CardFooter = ({ quote, timeline }: CardFooterProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          <b>Quote:</b> {"Rs. "}
          {quote}
        </Text>
        {/* <Text style={styles.footerText}>Timeline: {timeline}</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
  },
});
