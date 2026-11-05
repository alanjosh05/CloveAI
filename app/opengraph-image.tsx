import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Alan Joshua, AI engineer in Coimbatore, India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/brand/lockup.svg"), "utf8");
  const viewBox = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(logo);
  const ratio = viewBox ? Number(viewBox[1]) / Number(viewBox[2]) : 3;
  const height = 240;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#f5f1e8",
          color: "#565045",
          fontSize: 38,
        }}
      >
        <img
          alt=""
          width={height * ratio}
          height={height}
          src={`data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`}
        />
        <div style={{ marginTop: 40, display: "flex" }}>AI engineer in Coimbatore, India</div>
      </div>
    ),
    size,
  );
}
