import { useEffect } from "react";
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  const handleCount = () => {
    setCount(count + 1);
  };
  useEffect(() => {
    console.log("mounted");
    return () => {
      console.log("destory");
    };
  }, []);
  return (
    <>
      <h2>{count}</h2>
      <button onClick={handleCount}>ADD</button>
    </>
  );
}

export default Counter;
