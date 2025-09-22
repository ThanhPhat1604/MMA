import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { saveData } from "../utils/storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";  // ✅ dùng expo icon

// Định nghĩa type cho stack
type RootStackParamList = {
  Login: undefined;
  Task: undefined;
};

// Props cho màn Login
type Props = NativeStackScreenProps<RootStackParamList, "Login"> & {
  onLogin?: () => void;
};

// Schema validation
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
  password: Yup.string().min(6, "Tối thiểu 6 ký tự").required("Bắt buộc"),
});

export default function LoginScreen({ navigation, onLogin }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: { email: string; password: string }) => {
    const session = { isLoggedIn: true, email: values.email };
    await saveData("USER_SESSION", session);

    if (onLogin) onLogin();

    navigation.replace("Task");
  };

  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
      {/* Nền trang trí góc */}
      <View style={styles.topBlob} />
      <View style={styles.bottomBlob} />

      <View style={styles.card}>
        <Text style={styles.title}>Sign In</Text>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              {/* Email */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="email-outline" size={22} color="#6a11cb" />
                <TextInput
                  placeholder="E-mail"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  style={styles.input}
                  placeholderTextColor="#aaa"
                />
              </View>
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              {/* Password */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="lock-outline" size={22} color="#6a11cb" />
                <TextInput
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  style={styles.input}
                  placeholderTextColor="#aaa"
                />
                <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#6a11cb"
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}

              {/* Button */}
              <TouchableOpacity
                onPress={handleSubmit as any}
                style={{ marginTop: 20 }}
              >
                <LinearGradient
                  colors={["#6a11cb", "#2575fc"]}
                  style={styles.loginBtn}
                >
                  <Text style={styles.loginText}>LOGIN</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={{ color: "#444" }}>Don't have an account? </Text>
                <TouchableOpacity>
                  <Text style={[styles.link, { fontWeight: "bold" }]}>
                    Create
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 25,
    width: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 14,
    backgroundColor: "#f2f2f7",
    height: 50,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 15 },
  error: { color: "red", marginBottom: 8, marginLeft: 10 },
  loginBtn: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  loginText: { color: "#fff", fontWeight: "bold", fontSize: 17 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  link: { color: "#6a11cb" },

  // blob trang trí
  topBlob: {
    position: "absolute",
    top: -100,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  bottomBlob: {
    position: "absolute",
    bottom: -120,
    left: -90,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});
