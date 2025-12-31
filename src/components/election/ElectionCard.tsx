import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface Props {
  election: any;
  isAdmin: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ElectionCard = ({ election, isAdmin, onEdit, onDelete }: Props) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{election.name}</Text>

        {isAdmin && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit}>
              <Icon name="edit" size={22} color="#38bdf8" />
            </TouchableOpacity>

            <TouchableOpacity onPress={onDelete} style={{ marginLeft: 12 }}>
              <Icon name="delete" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Description */}
      <Text style={styles.description}>
        {election.electionInfo?.description}
      </Text>

      {/* Time */}
      <Text style={styles.time}>
        ⏱ {election.electionInfo?.startTime} -{" "}
        {election.electionInfo?.endTime}
      </Text>

      {/* Candidates */}
      <Text style={styles.subTitle}>Candidates</Text>

      {election.candidates.map((c: any) => (
        <View key={c._id} style={styles.candidate}>
          <Text style={styles.candidateName}>{c.name}</Text>
          <Text style={styles.party}>{c.party}</Text>
        </View>
      ))}

      {/* Status */}
      <View style={styles.statusRow}>
        <Text
          style={[
            styles.status,
            { color: election.isActive ? "#22c55e" : "#ef4444" },
          ]}
        >
          {election.isActive ? "Active" : "Inactive"}
        </Text>
      </View>
    </View>
  );
};

export default ElectionCard;
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#e5e7eb",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  actions: {
    flexDirection: "row",
  },
  description: {
    color: "#94a3b8",
    marginTop: 8,
  },
  time: {
    color: "#64748b",
    marginTop: 6,
    fontSize: 12,
  },
  subTitle: {
    marginTop: 14,
    color: "#38bdf8",
    fontWeight: "600",
  },
  candidate: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  candidateName: {
    color: "#e5e7eb",
  },
  party: {
    color: "#94a3b8",
  },
  statusRow: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  status: {
    fontWeight: "700",
  },
});
