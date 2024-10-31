"use client";
import NavigationBar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import "./globals.css"; // Import global styles
import "bootstrap/dist/css/bootstrap.min.css";

// export const metadata = {
//   title: "League Legacy",
//   description: "Historical Fantasy Sports Database",
//};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <NavigationBar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
