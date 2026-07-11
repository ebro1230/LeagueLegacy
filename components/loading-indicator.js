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
        <h4>{`Wow, you've been in this league a long time!`}</h4>
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
