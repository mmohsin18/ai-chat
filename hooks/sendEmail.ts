import axios from "axios";

export async function sendEmail(email: string) {
  await axios.post("/api/send-ticket", {
    email,
  });
}