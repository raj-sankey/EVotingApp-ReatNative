import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";

interface Props {
  visible: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  visible,
  title = "Confirm",
  message,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.deleteBtn]}
              onPress={onConfirm}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#020617",
    padding: 20,
    borderRadius: 16,
    width: "85%",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e5e7eb",
    marginBottom: 8,
  },
  message: {
    color: "#94a3b8",
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 10,
  },
  cancelBtn: {
    backgroundColor: "#1e293b",
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
  },
  cancelText: {
    color: "#e5e7eb",
    fontWeight: "600",
  },
  deleteText: {
    color: "#020617",
    fontWeight: "700",
  },
});
