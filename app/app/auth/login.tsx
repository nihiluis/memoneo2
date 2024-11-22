import * as React from "react"
import { View } from "react-native"
import { useForm } from "react-hook-form"
import { FormInput } from "@/components/form/FormInput"
import { Button } from "@/components/reusables/Button"
import { Text } from "@/components/reusables/Text"
import Logo from "@/components/Logo"
import { Stack } from "expo-router"

type LoginFormData = {
  email: string
  password: string
}

export default function LoginScreen() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: LoginFormData) => {
    console.log(data)
    // Handle login logic here
  }

  return (
    <View className="flex-1 justify-center p-4 bg-background">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="">
        <View className="mb-8">
          <View className="items-center mb-4">
            <Logo width={128} height={128} />
          </View>
          <Text className="text-xl text-muted-foreground text-center">
            Enter your credentials to sign in.
          </Text>
        </View>

        <View className="mb-8">
          <FormInput
            control={control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            rules={{
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please enter a valid email",
              },
            }}
            error={errors.email?.message}
          />

          <FormInput
            control={control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
            error={errors.password?.message}
          />
        </View>

        <Button size="lg" onPress={handleSubmit(onSubmit)}>
          <Text>Sign In</Text>
        </Button>
      </View>
    </View>
  )
}
