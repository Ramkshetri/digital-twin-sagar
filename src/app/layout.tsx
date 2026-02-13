import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Twin Sagar",
  description: "Cybersecurity Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
