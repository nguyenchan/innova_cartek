import React, { Component } from "react";
import { ScrollView, StyleSheet, Text, Picker } from "react-native";
import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider, graphql } from "react-apollo";
import gql from "graphql-tag";

const carQuery = gql`
	query {
		ymmes(db_market: "US") {
			text
			enum
		}
	}
`;

function customQuery(db_market, year, make, model, trim, option) {
	if (db_market === "") {
		return gql`
			query {
				ymmes(db_market: "") {
					text
					enum
				}
			}
		`;
	}

	if (db_market !== "") {
		return gql`
			query {
				ymmes(db_market: ${this.state.db_market}) {
					text
					enum
				}
			}
		`;
	}
}

const CarComponent = graphql(carQuery)(props => {
	const { error, ymmes } = props.data;
	console.log(props);
	if (error) {
		return <Text>{error}</Text>;
	}
	if (ymmes) {
		return (
			<ScrollView>
				{ymmes.map(ymmes => {
					return <Text key={ymmes.text}>{ymmes.text}</Text>;
				})}
			</ScrollView>
		);
	}
	return <Text>loading...</Text>;
});

export default class SettingsScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			db_market: ""
		};
	}

	updateMarket = market => {
		this.setState({ db_market: market });
	};

	componentDidUpdate() {
		console.log(this.state.db_market);
	}

	render() {
		return (
			<ScrollView style={styles.container}>
				<Text>Chose market</Text>
				<Picker
					style={{ width: 100 }}
					selectedValue={this.state.db_market}
					onValueChange={this.updateMarket}
				>
					<Picker.Item label="US" value="us" />
					<Picker.Item label="International" value="int" />
				</Picker>
			</ScrollView>
		);
	}
}

SettingsScreen.navigationOptions = {
	title: "App"
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 15,
		backgroundColor: "#fff"
	}
});
