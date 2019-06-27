import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider, graphql } from "react-apollo";
import gql from "graphql-tag";

const carQuery = gql`
	{
		ymmes(db_market: "US", year: 37, make: 4, model: 28) {
			text
			enum
		}
	}
`;

function customQuery(
	db_market = "",
	year = undefined,
	make = undefined,
	model = undefined,
	trim = undefined,
	option = undefined,
	engine = undefined
) {
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
		if (!year) {
			return gql`
			query {
				ymmes(db_market: ${db_market}) {
					text
					enum
				}
			}
		`;
		} else if (!make) {
			return gql`
			query {
				ymmes(db_market: ${db_market}, year: ${year}) {
					text
					enum
				}
			}
		`;
		} else if (!model) {
			return gql`
			query {
				ymmes(db_market: ${db_market}, year: ${year}, make: ${make}) {
					text
					enum
				}
			}
		`;
		} else if (model && make === 46) {
			//for Subaru
			if (!option) {
				return gql`
				query {
					ymmes(db_market: ${db_market}, year: ${year}, make: ${make}, model: ${model}) {
						text
						enum
					}
				}
				`;
			} else if (option && !engine) {
				return gql`
				query {
					ymmes(db_market: ${db_market}, year: ${year}, make: ${make}, model: ${model}, option: ${option}) {
						text
						enum
					}
				}
				`;
			} else if (option && engine) {
				return gql`
				query {
					ymmes(db_market: ${db_market}, year: ${year}, make: ${make}, model: ${model}, option: ${option}, engine: ${engine}) {
						text
						enum
					}
				}
				`;
			}
		} else if (model && make instanceof [4, 26, 28, 45]) {
			//for BMW, Mercedes-Benz, Mini, Smart
			if (!trim) {
				return gql`
				query {
					ymmes(db_market: ${db_market}, year: ${year}, make: ${make}, model: ${model}) {
						text
						enum
					}
				}
				`;
			} else if (!option) {
				return gql`
				query {
					ymmes(db_market: ${db_market}, year: ${year}, make: ${make}, model: ${model}, trim: ${trim}) {
						text
						enum
					}
				}
				`;
			} else if (!engine) {
				return gql`
				query {
					ymmes(db_market: ${db_market}, year: ${year}, make: ${make}, model: ${model}, trim: ${trim}, option: ${option}) {
						text
						enum
					}
				}
				`;
			} else if (engine) {
				return gql`
				query {
					ymmes(db_market: ${db_market}, year: ${year}, make: ${make}, model: ${model}, trim: ${trim}, option: ${option}, engine: ${engine}) {
						text
						enum
					}
				}
				`;
			}
		} else if (model && !trim && !option) {
			//for all other make
			if (!engine) {
				return gql`
				query {
					ymmes(db_market: ${db_market}, year: ${year}, make: ${make}, model: ${model}) {
						text
						enum
					}
				}
				`;
			} else {
				return gql`
				query {
					ymmes(db_market: ${db_market}, year: ${year}, make: ${make}, model: ${model}, engine: ${engine}) {
						text
						enum
					}
				}
				`;
			}
		}
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
					return (
						<Text key={ymmes.text}>
							{ymmes.text} / {ymmes.enum}
						</Text>
					);
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
	title: "Test"
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 15,
		backgroundColor: "#fff"
	}
});
