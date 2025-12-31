import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  role: "student" | "admin";
  onChange: (role: "student" | "admin") => void;
}

export default function RoleSwitch({ role, onChange }: Props) {
  return (
    <View style={styles.container}>
      {["student", "admin"].map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.button,
            role === item && styles.activeButton,
          ]}
          onPress={() => onChange(item as any)}
        >
          <Text
            style={[
              styles.text,
              role === item && styles.activeText,
            ]}
          >
            {item.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 30,
    padding: 4,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#22c55e",
  },
  text: {
    color: "#94a3b8",
    fontWeight: "600",
  },
  activeText: {
    color: "#020617",
  },
});
