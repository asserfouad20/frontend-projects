export default function Post() {
  return (
    <div
      style={{
        padding: "10px",
        border: "solid teal 5px",
        width: "50%",
        margin: "25px",
      }}
    >
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        This is the post title
      </h1>
      <hr />
      <p
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        This is the post content
      </p>
    </div>
  );
}
