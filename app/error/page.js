"use client";
import { useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; // Import useSession and signOut
import { useEffect } from "react";

export default function ErrorPage() {
  const { data: session } = useSession(); // Access session data
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message");
  const errorStatus = searchParams.get("status");
  console.log(`ERROR MESSAGE: ${errorMessage}`);
  console.log(`ERROR STATUS: ${errorStatus}`);
  console.log(typeof errorStatus);

  //   useEffect(() => {
  //     if (session) {
  //       signOut();
  //     }
  //   });

  return (
    <div className="errorpage-div">
      {errorStatus === "null" || errorStatus === "undefined" ? (
        <h1>Error: {errorMessage}</h1>
      ) : (
        <h1>
          {errorStatus} Error: {errorMessage}
        </h1>
      )}
    </div>
  );
}
