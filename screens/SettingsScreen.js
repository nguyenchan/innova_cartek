import React, { Component } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	Picker,
	Button,
	View,
	TouchableOpacity
} from "react-native";
import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider, graphql, Query } from "react-apollo";
import gql from "graphql-tag";

const carQuery = gql`
	query($market: String!) {
		ymmes(db_market: $market) {
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

// client
// 	.query({ query: carQuery, variables: { db_market: "US" } })
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
				db_market: "us",
				year: { text: "", enum: undefined },
				make: { text: "", enum: undefined },
				model: { text: "", enum: undefined },
				trim: { text: "", enum: undefined },
				option: { text: "", enum: undefined },
				engine: { text: "", enum: undefined }
			},
			showQuery: ""
		};
	}

	resetQuery() {
		this.setState({
			ymmes: {
				db_market: "us",
				year: { text: "", enum: undefined },
				make: { text: "", enum: undefined },
				model: { text: "", enum: undefined },
				trim: { text: "", enum: undefined },
				option: { text: "", enum: undefined },
				engine: { text: "", enum: undefined }
			},
			showQuery: ""
		});
	}

	onPressQuery(query) {
		if (query === "query1") {
			this.setState({ showQuery: "query1" });
		}

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
		console.log("Market:", this.state.ymmes.db_market);
		console.log("Now show:", this.state.showQuery);
	}

	queryTest1() {
		// 	console.log("query", market);
		// 	return gql`
		// 	query($market: String!){
		// 		ymmes(db_market: $market) {
		// 			text
		// 			enum
		// 		}
		// 	}
		// `;
	}

	render() {
		const query1 = gql`
			query($market: String) {
				ymmes(db_market: $market) {
					text
					enum
				}
			}
		`;
		const query2 = gql`
			query($market: String, $year: int) {
				ymmes(db_market: $market, year: $year) {
					text
					enum
				}
			}
		`;
		return (
			<View style={styles.container}>
				<Button onPress={() => this.resetQuery()} title="Reset" color="red" />
				<ScrollView style={{ alignSelf: "stretch" }}>
					<View style={styles.picker_wrapper}>
						<Text>Chose market</Text>
						<Picker
							style={{ width: 150 }}
							selectedValue={this.state.ymmes.db_market}
							onValueChange={this.updateMarket}
						>
							<Picker.Item label="us" value="us" />
							<Picker.Item label="international" value="int" />
						</Picker>
						<Button
							onPress={() => this.onPressQuery("query1")}
							title="Query"
							color="#841584"
						/>
						{this.state.showQuery === "query1" && (
							<ApolloProvider client={client}>
								<Query
									query={query1}
									variables={{ db_market: this.state.ymmes.db_market }}
									fetchPolicy="network-only"
								>
									{({ error, loading, data }) => {
										if (error) return <Text>error! ${error}</Text>;
										if (loading) return <Text>"Loading..."</Text>;
										const { ymmes } = data;
										return ymmes.map(ymmes => {
											return (
												<TouchableOpacity
													onPress={() => {
														this.onPressQuery("query2");
													}}
													style={styles.result_wrap}
													key={ymmes.enum}
												>
													<Text style={{ width: 100 }}>
														Year: {ymmes.text}
													</Text>
													<Text style={{ width: 80 }}>enum: {ymmes.enum}</Text>
												</TouchableOpacity>
											);
										});
									}}
								</Query>
							</ApolloProvider>
						)}
					</View>
				</ScrollView>
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
	},
	picker_wrapper: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	result_wrap: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-evenly",
		width: 200,
		height: 30,
		paddingTop: 5
	}
});
