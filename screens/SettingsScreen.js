import React, { Component } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	Picker,
	Button,
	View
} from "react-native";
import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider, graphql, Query } from "react-apollo";
import gql from "graphql-tag";

const carQuery = gql`
	{
		ymmes(db_market: "US", year: 37) {
			text
			enum
		}
	}
`;

const client = new ApolloClient({
	link: new HttpLink({
		uri: "http://34.210.160.172:4000/graphql",
		headers: {
			// authorization: "YOUR_TOKEN" // on production you need to store token in storage or in redux persist, for demonstration purposes we do this like that
		}
	}),
	cache: new InMemoryCache()
});

// client
// 	.query({
// 		query: carQuery
// 	})
// 	.then(res => console.log(res));

function customQuery(db_market, year, make, model, trim, option, engine) {
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
			ymmes: {
				db_market: "",
				year: undefined,
				make: undefined,
				model: undefined,
				trim: undefined,
				option: undefined,
				engine: undefined
			}
		};
	}

	onPressQuery() {
		async () => {
			const { data } = await client.query({
				query: carQuery
			});
			await console.log(data);
		};

		// return (
		// 	<ApolloProvider client={client}>
		// 		<Text style={styles.welcome}>Result bellow:</Text>
		// 		<CarComponent />
		// 	</ApolloProvider>
		// );
	}

	updateMarket = market => {
		this.setState({ ymmes: { db_market: market } });
	};

	componentDidUpdate() {
		console.log(this.state.ymmes.db_market);
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>Chose market</Text>
				<Picker
					style={{ width: 150 }}
					selectedValue={this.state.ymmes.db_market}
					onValueChange={this.updateMarket}
				>
					<Picker.Item label="us" value="us" />
					<Picker.Item label="international" value="int" />
				</Picker>
				<View style={{ width: 150 }}>
					<Button onPress={this.onPressQuery} title="Query" color="#841584" />
				</View>
				<ApolloProvider client={client}>
					<Query query={carQuery}>
						{({ error, loading, data }) => {
							if (error) return <div>error! ${error}</div>;
							if (loading) return "Loading...";
							const { ymmes } = data;
							return ymmes.map(ymmes => {
								return <Text key={ymmes.text}>{ymmes.text}</Text>;
							});
						}}
					</Query>
				</ApolloProvider>
			</View>
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
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center"
	}
});
