// Function to validate a email address
export const checkValidEmail = (email) => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z](?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

  if (!email) return false;

  if (email.length > 254) return false;

  const valid = emailRegex.test(email);
  if (!valid) return false;

  // Further checking of some things regex can't handle
  const parts = email.split("@");
  if (parts[0].length > 64) return false;

  const domainParts = parts[1].split(".");
  if (domainParts.some((part) => part.length > 63)) return false;

  return true;
};

export function formatTime(dateString) {
  const date = new Date(dateString);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12; // Convert to 12-hour format
  hours = String(hours).padStart(2, "0");

  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

export function formatDateTime(dateString) {
  const date = new Date(dateString);

  // Extract date components
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const year = date.getFullYear();

  // Extract time components
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12; // Convert to 12-hour format
  hours = String(hours).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}
