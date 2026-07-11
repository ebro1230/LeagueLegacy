import { RotatingLines } from "react-loader-spinner";

export default function LoadingIndicator({ longLoading }) {
  return (
    //displays three dots loader
    <div
      style={{
        width: "100%",
        height: "100",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {longLoading ? (
        <>
          <h3
            style={{ color: "ivory" }}
          >{`Sorry this is taking longer than expected...`}</h3>
          <h3
            style={{ color: "ivory" }}
          >{`You must have been in this league for a long time!`}</h3>
        </>
      ) : null}
      <RotatingLines
        strokeColor="ivory"
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible={true}
      />
    </div>
  );
}
