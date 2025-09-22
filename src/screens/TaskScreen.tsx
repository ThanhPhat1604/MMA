import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  addTask,
  toggleTask,
  removeTask,
  clearTasks,
} from "../redux/taskSlice";
import { ThemeContext } from "../context/ThemeContext";
import { removeData } from "../utils/storage";
import type { RootState, AppDispatch } from "../redux/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Định nghĩa các màn hình
type RootStackParamList = {
  Login: undefined;
  Task: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Task"> & {
  onLogout?: () => void;
};

export default function TaskScreen({ navigation, onLogout }: Props) {
  const tasks = useSelector((state: RootState) => state.stasks.tasks);
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState("");
  const { theme, toggleTheme } = useContext(ThemeContext);

  const themeStyles = {
    backgroundColor: theme === "light" ? "#fff" : "#111",
    color: theme === "light" ? "#000" : "#fff",
  };

  const handleAdd = () => {
    if (!title.trim()) return;
    dispatch(addTask(title.trim()));
    setTitle("");
  };

  const handleLogout = async () => {
    await removeData("USER_SESSION");
    if (onLogout) onLogout();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const confirmRemoveAll = () => {
    Alert.alert("Xác nhận", "Xóa tất cả tasks?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => dispatch(clearTasks()),
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: themeStyles.color }]}>Tasks</Text>
        <View style={styles.headerButtons}>
          <Button title={`Theme: ${theme}`} onPress={toggleTheme} />
          <Button title="Logout" onPress={handleLogout} />
        </View>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Thêm task..."
          value={title}
          onChangeText={setTitle}
          style={[
            styles.input,
            { color: themeStyles.color, borderColor: "#ccc" },
          ]}
          placeholderTextColor={theme === "light" ? "#999" : "#888"}
        />
        <Button title="Add" onPress={handleAdd} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
            <TouchableOpacity
              onPress={() => dispatch(toggleTask(item.id))}
              style={{ flex: 1 }}
            >
              <Text
                style={{
                  color: themeStyles.color,
                  textDecorationLine: item.completed ? "line-through" : "none",
                }}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
            <Button title="Delete" onPress={() => dispatch(removeTask(item.id))} />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={{ marginTop: 12 }}>
        <Button title="Clear all tasks" onPress={confirmRemoveAll} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 20 },
  headerButtons: { flexDirection: "row", gap: 8 },
  inputRow: { flexDirection: "row", marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, padding: 8, marginRight: 8 },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  separator: { height: 1, backgroundColor: "#ddd" },
});
