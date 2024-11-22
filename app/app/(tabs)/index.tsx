import { StyleSheet } from "react-native"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import AuthLoader from "@/components/auth/AuthLoader"

export default function HomeScreen() {
  return (
    <ThemedView style={styles.titleContainer}>
      <AuthLoader>
        <ThemedText>Hello</ThemedText>
      </AuthLoader>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
})
