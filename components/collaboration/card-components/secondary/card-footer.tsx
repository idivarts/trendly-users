import { Text, View } from "@/components/theme/Themed";
import React from "react";
import { StyleSheet } from "react-native";

type CardFooterProps = {
  quote: string;
};

export const CardFooter = ({ quote }: CardFooterProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          <Text style={{ fontWeight: 600 }}>Quote:</Text> {"Rs. "}
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
