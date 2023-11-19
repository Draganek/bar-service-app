export default function getCurrentTime(schowSeconds = false) {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  if (schowSeconds) {
    return `${hours}:${minutes}:${seconds}`;
  } else {
    return `${hours}:${minutes}`;
  }
}
