import React, { useContext } from 'react'
import { View } from './Themed'
import { FlatList, StyleSheet, Text } from 'react-native';
import LogContext from '@/contexts/LogContext';

const LogNoter = () => {
    // const data = ["Hello there", "Test Something more"]
    const { data } = useContext(LogContext)
    return (
        <View style={styles.logContainer}>
            <FlatList data={data} renderItem={(item) => <Text>{item.item}</Text>} />
        </View>
    )
}

const styles = StyleSheet.create({
    logContainer: {
        backgroundColor: "grey",
        padding: 10,
        margin: 10
    }
});

export default LogNoter