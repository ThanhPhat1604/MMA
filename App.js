import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { ThemeProvider } from "./src/context/ThemeContext";
import { getData, saveData } from "./src/utils/storage";
import { setTasks } from "./src/redux/taskSlice";

import LoginScreen from "./src/screens/LoginScreen";
import TaskScreen from "./src/screens/TaskScreen";

const Stack = createNativeStackNavigator();
export default function App(){
  const [loading, setLoading]=useState(true);
  const [isLoggedIn, setIsLoggedIn]= useState(false);
  useEffect(()=>{
    (async ()=>{
      const user = await getData("USER_SESSION");
      setIsLoggedIn(!!(user && user.isLoggedIn));

      const savedTasks=await getData("STASKS");
      if (savedTasks){
        store.dispatch(SetTasks(savedTasks));
      }
      let prev = store.getState().tasks.tasks;
      store.subscribe(() =>{
        const current = store.getState().stasks.tasks;
        if (prev !== current){
          saveData("TASKS",current);
          prev = current;
        }
      });
      setLoading(false);
    })();
  },[]);
  if(loading){
    return(
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return(
    <Provider store={store}>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{HeaderShown:false}}>
            {!isLoggedIn ? (
              <Stack.Screen name="Login">
                {props =><LoginScreen{...props} onLogin={()=>setIsLoggedIn(true)} />}
              </Stack.Screen>
            ):(
              <Stack.Screen name="Task">
                {props => <TaskScreen {...props} onLogout={() => setIsLoggedIn(false)} />}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
}