import { jwtDecode as jwtDecodeFn } from "jwt-decode";

// Define the expected JWT payload structure
interface JWTPayload {
  authId: string;
  role: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

// Function to get authId from JWT token
function getAuthIdFromToken(): string | null {
  try {
    // Check if we're on the client side
    if (typeof window === "undefined") {
      return null;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("No access token found in localStorage.");
      return null;
    }

    const decoded = jwtDecodeFn<JWTPayload>(token);
    console.log("decoded", decoded);

    return decoded.authId || null;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}

// Alternative function that takes token as parameter
function getAuthIdFromJWT(token: string): string | null {
  try {
    const decoded = jwtDecodeFn<JWTPayload>(token);
    return decoded.authId || null;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}

// Usage examples:
// const authId = getAuthIdFromToken(); // Gets from localStorage
// const authId = getAuthIdFromJWT(someToken); // Pass token directly

export { getAuthIdFromToken, getAuthIdFromJWT };
export default getAuthIdFromToken;
