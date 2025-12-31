import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/auth/authSlice";
import { studentLogin, adminLogin } from "../../api/authApi";
import RoleSwitch from "../../components/auth/RoleSwitch";

export default function LoginScreen() {
  const dispatch = useDispatch();

  const [role, setRole] = useState<"student" | "admin">("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response =
        role === "student"
          ? await studentLogin({ username, password })
          : await adminLogin({ username, password });

      dispatch(
        loginSuccess({
          user: response.data,
          role,
        })
      );
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>E-Vote Login</Text>

      <RoleSwitch role={role} onChange={setRole} />

      <TextInput
        placeholder="Username"
        placeholderTextColor="#94a3b8"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#94a3b8"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#020617" />
        ) : (
          <Text style={styles.loginText}>
            Login as {role.toUpperCase()}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#22c55e",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 16,
    color: "#e5e7eb",
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#22c55e",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#020617",
    fontWeight: "700",
    fontSize: 16,
  },
});
