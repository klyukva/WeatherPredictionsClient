import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import { ThemeProvider } from "react-native-elements";

import Fire from "../Fire";

class LastTenPredictions extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || "Prediction"
  });

  state = {
    tableHead: [
      "City",
      "Prediction temperature",
      "Current status",
      "Real temperature",
      "Processing date"
    ],
    tableData: []
  };

  componentDidMount() {
    Fire.shared.onSelf(this.props.navigation.getParam("name"), prediction => {
      this.setState(previousState => ({
        tableData: [Object.values(prediction)].concat(previousState.tableData)
      }));
    });
  }

  render() {
    console.log(JSON.stringify(this.state));
    return (
      <ThemeProvider>
        <View style={styles.container}>
          <Text style={styles.title}>History</Text>
          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Row
              data={this.state.tableHead}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={this.state.tableData} textStyle={styles.text} />
          </Table>
        </View>
      </ThemeProvider>
    );
  }
}

const offset = 24;
const styles = StyleSheet.create({
  title: {
    alignSelf: "center",
    marginBottom: offset,
    fontSize: offset
  },
  container: { flex: 1, padding: 6, paddingTop: 30, backgroundColor: "#fff" },
  head: { backgroundColor: "#f1f8ff", height: 50 },
  text: { margin: 3, fontSize: 12 }
});

export default LastTenPredictions;
