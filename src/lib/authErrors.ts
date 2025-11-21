export function mapFirebaseAuthError(err: any) {
  if (!err || !err.code) {
    return { message: "Something went wrong. Try again.", code: "unknown" };
  }

  const code = err.code.replace("auth/", "");

  const map: Record<string, string> = {
    "invalid-email": "Please enter a valid email address.",
    "email-already-in-use": "This email address is already registered.",
    "weak-password": "Password is too weak. Please use at least 6 characters.",
    "user-not-found": "No account exists with this email address.",
    "wrong-password": "Incorrect password. Please try again.",
    "missing-password": "Please enter your password.",
    "network-request-failed": "Network issue: Unable to connect to Firebase. Please check your internet connection or firewall settings.",
    "unauthorized-domain": "Authentication from this domain is not authorized. (This is a developer configuration issue).",
    "too-many-requests": "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.",
    "invalid-credential": "We couldn't verify the login credential. Please try again or choose a different sign-in method.",
  };

  return { message: map[code] ?? `An unexpected error occurred: ${code}`, code };
}
