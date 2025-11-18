const Github = ({ start }) => {
  return (
    <a href="https://github.com/kellyjosephprice/thunk">
      <img
        alt="Github Link"
        className={`Github ${start ? "Github-on" : ""}`}
        src={process.env.PUBLIC_URL + "/github-corner-right.svg"}
      />
    </a>
  );
};

export default Github;
