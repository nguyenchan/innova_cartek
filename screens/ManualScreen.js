import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function ManualScreen() {
	return (
		<ScrollView style={styles.container}>
			<Text>some thing</Text>
		</ScrollView>
	);
}

ManualScreen.navigationOptions = {
	title: "Manual"
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 15,
		backgroundColor: "#fff"
	}
});
