export function Heading({
  lead,
  accent,
  align = "left",
  light = false,
}: {
  lead: string;
  accent: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <h2
      className={`text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight ${
        align === "center" ? "text-center" : ""
      } ${light ? "text-white" : "text-ink"}`}
    >
      {lead}{" "}
      <span className={`accent ${light ? "text-white" : "text-ink"}`}>{accent}</span>
    </h2>
  );
}
