import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { getAllElections } from "../../api/electionApi";
import ElectionCard from "../../components/election/ElectionCard";

const HomeScreen = ({ navigation }: any) => {
  const { role } = useSelector((state: RootState) => state.auth);
  const isAdmin = role === "admin";

  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await getAllElections();
      setElections(res.data.elections);
    } catch (error) {
      console.log("Election fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Elections</Text>

        {isAdmin && (
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => navigation.navigate("CreateElection")}
          >
            <Text style={styles.createText}>+ Create</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={elections}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ElectionCard
            election={item}
            isAdmin={isAdmin}
            onEdit={() =>
              navigation.navigate("EditElection", { election: item })
            }
            onDelete={() => console.log("Delete", item._id)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#22c55e",
  },
  createBtn: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createText: {
    color: "#020617",
    fontWeight: "700",
  },
  loader: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },
});
