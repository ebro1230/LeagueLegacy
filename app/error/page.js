"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Error() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message");
  const errorStatus = searchParams.get("status");

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

export default function ErrorPage() {
  return (
    <Suspense>
      <Error />
    </Suspense>
  );
}
