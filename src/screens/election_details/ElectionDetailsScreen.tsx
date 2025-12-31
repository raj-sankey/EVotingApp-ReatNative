import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import {
  getElectionDetail,
  voteForCandidate,
  getLiveResults,
} from "../../api/electionApi";

const ElectionDetailScreen = ({ route }: any) => {
  const { electionId } = route.params;
  const { role } = useSelector((state: RootState) => state.auth);
  const isAdmin = role === "admin";

  const [election, setElection] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  // ✅ GLOBAL VOTE STATE
  const [hasVoted, setHasVoted] = useState(false);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetchElection();
  }, []);

  const fetchElection = async () => {
    try {
      const res = await getElectionDetail(electionId);
      setElection(res.data.election);

      if (isAdmin) {
        const resultRes = await getLiveResults(electionId);
        setResults(resultRes.data);
      }
    } catch (e) {
      console.log("Fetch election error", e);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HANDLE VOTE ---------------- */
  const handleVote = async (candidateId: string) => {
    try {
      setVoting(true);

      await voteForCandidate(electionId, candidateId);

      setHasVoted(true); // ✅ user voted

      Alert.alert("Success", "Vote cast successfully");

      fetchElection(); // refresh counts
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.response?.data?.message || "Voting failed"
      );
    } finally {
      setVoting(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{election.name}</Text>

      {/* Description */}
      <Text style={styles.desc}>
        {election.electionInfo.description}
      </Text>

      {/* Time */}
      <Text style={styles.time}>
        ⏱ {election.electionInfo.startTime} -{" "}
        {election.electionInfo.endTime}
      </Text>

      {/* Candidates */}
      <Text style={styles.section}>Candidates</Text>

      {election.candidates.map((c: any) => (
        <View key={c._id} style={styles.card}>
          <Text style={styles.candidateName}>{c.name}</Text>
          <Text style={styles.party}>{c.party}</Text>
          <Text style={styles.bio}>{c.bio}</Text>

          {/* STUDENT → SHOW VOTE ONLY IF NOT VOTED */}
          {!isAdmin && !hasVoted && (
            <TouchableOpacity
              style={styles.voteBtn}
              disabled={!election.isActive || voting}
              onPress={() => handleVote(c._id)}
            >
              <Text style={styles.voteText}>
                {voting ? "Voting..." : "Vote"}
              </Text>
            </TouchableOpacity>
          )}

          {/* ADMIN → SHOW COUNT */}
          {isAdmin && (
            <Text style={styles.voteCount}>
              Votes: {c.votes}
            </Text>
          )}
        </View>
      ))}

      {/* ✅ SUCCESS MESSAGE (ONCE, BELOW LIST) */}
      {!isAdmin && hasVoted && (
        <Text style={styles.votedMessage}>
          You have voted successfully.
        </Text>
      )}

      {/* ADMIN → LIVE RESULTS */}
      {isAdmin && results && (
        <>
          <Text style={styles.section}>Live Results</Text>

          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              Total Votes: {results.totalVotes}
            </Text>

            {results.results.map((r: any) => (
              <View key={r._id} style={styles.resultRow}>
                <Text style={styles.resultName}>{r.name}</Text>
                <Text style={styles.resultVotes}>
                  {r.votes} ({r.percentage}%)
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default ElectionDetailScreen;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 16,
  },
  loader: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#22c55e",
    marginBottom: 8,
  },
  desc: {
    color: "#94a3b8",
    marginBottom: 6,
  },
  time: {
    color: "#64748b",
    marginBottom: 16,
  },
  section: {
    color: "#38bdf8",
    fontWeight: "700",
    marginVertical: 12,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  candidateName: {
    color: "#e5e7eb",
    fontWeight: "700",
    fontSize: 16,
  },
  party: {
    color: "#94a3b8",
  },
  bio: {
    color: "#64748b",
    fontSize: 12,
    marginBottom: 8,
  },
  voteBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  voteText: {
    color: "#020617",
    fontWeight: "700",
  },
  votedMessage: {
    color: "#22c55e",
    fontWeight: "700",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 10,
  },
  voteCount: {
    color: "#22c55e",
    fontWeight: "700",
    marginTop: 8,
  },
  resultBox: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 14,
  },
  resultText: {
    color: "#e5e7eb",
    fontWeight: "700",
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  resultName: {
    color: "#e5e7eb",
  },
  resultVotes: {
    color: "#22c55e",
    fontWeight: "600",
  },
});
