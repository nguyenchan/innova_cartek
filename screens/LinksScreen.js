import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
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

const client = new ApolloClient({
	link: new HttpLink({
		uri: "http://34.210.160.172:4000/graphql",
		headers: {
			// authorization: "YOUR_TOKEN" // on production you need to store token in storage or in redux persist, for demonstration purposes we do this like that
		}
	}),
	cache: new InMemoryCache()
});

export default function LinksScreen() {
	return (
		<ScrollView style={styles.container}>
			<Text>graphql query</Text>
			<ApolloProvider client={client}>
				<Text style={styles.welcome}>Result bellow:</Text>
				<CarComponent />
			</ApolloProvider>
		</ScrollView>
	);
}

LinksScreen.navigationOptions = {
	title: "Year"
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 15,
		backgroundColor: "#fff"
	}
});
