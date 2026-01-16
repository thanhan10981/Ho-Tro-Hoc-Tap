import axios from "../utils/axios";

/**
 * Gửi OTP tới email mới
 */
export async function sendOtp(email: string): Promise<void> {
  await axios.post("/api/email-otp/send", {
    email,
  });
}

/**
 * Verify OTP
 */
export async function verifyOtp(
  email: string,
  otp: string
): Promise<void> {
  await axios.post("/api/email-otp/verify", {
    email,
    otp,
  });
}
