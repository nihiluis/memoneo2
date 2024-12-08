export function getToken(headers: { authorization: string }) {
    const [bearer, token] = headers.authorization.split(" ")
    if (bearer !== "Bearer") {
      throw new Error("Invalid authorization header")
    }
    return token
  }