"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Error() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message");
  const errorStatus = searchParams.get("status");

  return (
    <div className="normal-background" style={{ height: "100vh" }}>
      <div className="errorpage-div" style={{ paddingTop: "10rem" }}>
        {errorStatus === "null" || errorStatus === "undefined" ? (
          <h3
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            Error: {errorMessage}
          </h3>
        ) : (
          <h3
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            {errorStatus} Error: {errorMessage}
          </h3>
        )}
      </div>
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
