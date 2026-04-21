"use client";

interface SectionDividerProps {
  variant: "diagonal" | "diagonal-reverse" | "wave" | "wave-reverse" | "curved";
  fromColor?: string;
  toColor?: string;
  height?: number;
}

export default function SectionDivider({
  variant,
  fromColor = "#080808",
  toColor = "#F4EEE4",
  height = 90,
}: SectionDividerProps) {
  if (variant === "diagonal") {
    return (
      <div
        style={{
          position: "relative",
          marginTop: -1,
          marginBottom: -1,
          height: height,
          background: toColor,
          clipPath: `polygon(0 ${height}px, 100% 0, 100% 100%, 0 100%)`,
          zIndex: 10,
        }}
      />
    );
  }

  if (variant === "diagonal-reverse") {
    return (
      <div
        style={{
          position: "relative",
          marginTop: -1,
          marginBottom: -1,
          height: height,
          background: toColor,
          clipPath: `polygon(0 0, 100% ${height}px, 100% 100%, 0 100%)`,
          zIndex: 10,
        }}
      />
    );
  }

  if (variant === "wave") {
    return (
      <div style={{ position: "relative", marginTop: -1, marginBottom: -1, zIndex: 10 }}>
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: height }}
        >
          <path
            d={`M0,0 C240,${height} 720,0 1440,${height * 0.67} L1440,${height} L0,${height} Z`}
            fill={toColor}
          />
        </svg>
      </div>
    );
  }

  if (variant === "wave-reverse") {
    return (
      <div style={{ position: "relative", marginTop: -1, marginBottom: -1, zIndex: 10 }}>
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: height }}
        >
          <path
            d={`M0,${height * 0.67} C480,0 960,${height} 1440,${height * 0.33} L1440,${height} L0,${height} Z`}
            fill={toColor}
          />
        </svg>
      </div>
    );
  }

  // curved
  return (
    <div style={{ position: "relative", marginTop: -1, marginBottom: -1, zIndex: 10 }}>
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: height }}
      >
        <path
          d={`M0,${height * 0.5} C600,0 840,${height} 1440,${height * 0.5} L1440,${height} L0,${height} Z`}
          fill={toColor}
        />
      </svg>
    </div>
  );
}
