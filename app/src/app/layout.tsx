import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAGA Autonomous AI Worker Foundry & Machine Registry",
  description:
    "Industrial Autonomous AI Worker Foundry on NEAR Protocol. NEP-171 token-bound accounts with NEP-178 transfer-locks and sub-account execution engine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-ground text-iceWhite min-h-screen antialiased selection:bg-cobalt selection:text-white">
        {children}
      </body>
    </html>
  );
}
