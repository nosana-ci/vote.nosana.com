export default function formatCETDate(isoString: string | undefined) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "—";
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const partMap = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );
  const month = partMap.month || "";
  const day = partMap.day || "";
  const hour = partMap.hour || "";
  const minute = partMap.minute || "";
  return `${month} ${day}, ${hour}:${minute} CET`;
}