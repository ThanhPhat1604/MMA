// src/screens/TaskScreen.js
import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { addTask, toggleTask, removeTask, clearTasks } from "../redux/taskSlice";
import { ThemeContext } from "../context/ThemeContext";
import { removeData, saveData } from "../utils/storage";

export default function TaskScreen({ navigation, onLogout }) {
  const tasks = useSelector(state => state.tasks.tasks);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const { theme, toggleTheme } = useContext(ThemeContext);

  const themeStyles = {
    backgroundColor: theme === "light" ? "#fff" : "#111",
    color: theme === "light" ? "#000" : "#fff"
  };

  const handleAdd = () => {
    if (!title.trim()) return;
    dispatch(addTask(title.trim()));
    setTitle("");
  };

  const handleLogout = async () => {
    // clear session & optionally tasks/theme
    await removeData("USER_SESSION");
    // optional: keep tasks; if want to clear tasks too:
    // await removeData("TASKS");
    if (onLogout) onLogout();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const confirmRemoveAll = () => {
    Alert.alert("Xác nhận", "Xóa tất cả tasks?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: () => dispatch(clearTasks()) }
    ]);
  };

  return (
    <View style={{flex:1,padding:20,backgroundColor:themeStyles.backgroundColor}}>
      <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <Text style={{fontSize:20,color:themeStyles.color}}>Tasks</Text>
        <View style={{flexDirection:"row",gap:8}}>
          <Button title={`Theme: ${theme}`} onPress={toggleTheme} />
          <Button title="Logout" onPress={handleLogout} />
        </View>
      </View>

      <View style={{flexDirection:"row",marginBottom:12}}>
        <TextInput
          placeholder="Thêm task..."
          value={title}
          onChangeText={setTitle}
          style={{flex:1,borderWidth:1,padding:8,marginRight:8,color:themeStyles.color,borderColor:"#ccc"}}
          placeholderTextColor={theme === "light" ? "#999" : "#888"}
        />
        <Button title="Add" onPress={handleAdd} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingVertical:8}}>
            <TouchableOpacity onPress={() => dispatch(toggleTask(item.id))} style={{flex:1}}>
              <Text style={{color: themeStyles.color, textDecorationLine: item.completed ? "line-through" : "none"}}>
                {item.title}
              </Text>
            </TouchableOpacity>
            <Button title="Delete" onPress={() => dispatch(removeTask(item.id))} />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{height:1,backgroundColor:"#ddd"}} />}
      />

      <View style={{marginTop:12}}>
        <Button title="Clear all tasks" onPress={confirmRemoveAll} />
      </View>
    </View>
  );
}
