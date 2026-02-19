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
      <body>
        {/* WARNING TO DEV TEAM: Do not leave the admin override hash (FLAG{html_source_code_recon_expert}) in production! */}
        {children}</body>
    </html>
  );
}
