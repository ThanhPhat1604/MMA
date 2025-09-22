// src/screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { saveData } from "../utils/storage";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
  password: Yup.string().min(6, "Tối thiểu 6 ký tự").required("Bắt buộc")
});

export default function LoginScreen({ navigation, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values) => {
    const session = { isLoggedIn: true, email: values.email };
    await saveData("USER_SESSION", session);
    if (onLogin) onLogin();
    navigation.reset({ index: 0, routes: [{ name: "Task" }] });
  };

  return (
    <View style={{flex:1,justifyContent:"center",padding:20}}>
      <Text style={{fontSize:24,marginBottom:20}}>Login</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <Text>Email</Text>
            <TextInput
              placeholder="you@mail.com"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              style={{borderWidth:1,padding:8,marginBottom:5}}
            />
            {touched.email && errors.email && <Text style={{color:"red"}}>{errors.email}</Text>}

            <Text>Password</Text>
            <View style={{flexDirection:"row",alignItems:"center"}}>
              <TextInput
                placeholder="password"
                secureTextEntry={!showPassword}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                style={{flex:1,borderWidth:1,padding:8,marginBottom:5}}
              />
              <TouchableOpacity onPress={() => setShowPassword(s => !s)} style={{marginLeft:8}}>
                <Text>{showPassword ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>
            {touched.password && errors.password && <Text style={{color:"red"}}>{errors.password}</Text>}

            <Button title="Login" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </View>
  );
}
