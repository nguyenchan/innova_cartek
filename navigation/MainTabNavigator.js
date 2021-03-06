import React from "react";
import { Platform } from "react-native";
import {
	createStackNavigator,
	createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import ApiScreen from "../screens/ApiScreen";
import ManualScreen from "../screens/ManualScreen";
import SettingsScreen from "../screens/SettingsScreen";

const HomeStack = createStackNavigator({
	Home: HomeScreen
});

HomeStack.navigationOptions = {
	tabBarLabel: "Home",
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={
				Platform.OS === "ios"
					? `ios-information-circle${focused ? "" : "-outline"}`
					: "md-information-circle"
			}
		/>
	)
};

const ApiStack = createStackNavigator({
	Api: ApiScreen
});

ApiStack.navigationOptions = {
	tabBarLabel: "API",
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={Platform.OS === "ios" ? "ios-wifi" : "md-wifi"}
		/>
	)
};

const ManualStack = createStackNavigator({
	Links: ManualScreen
});

ManualStack.navigationOptions = {
	tabBarLabel: "Manual",
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={Platform.OS === "ios" ? "ios-code" : "md-code"}
		/>
	)
};

const SettingsStack = createStackNavigator({
	Settings: SettingsScreen
});

SettingsStack.navigationOptions = {
	tabBarLabel: "Settings",
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={Platform.OS === "ios" ? "ios-options" : "md-options"}
		/>
	)
};

export default createBottomTabNavigator({
	HomeStack,
	ApiStack,
	ManualStack,
	SettingsStack
});
