import Counter from "./Counter";
import React,{ useState } from "react";

export default function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      {count}
      <h1>Hello World</h1>
      <Button onClick={() => setCount(pre => pre +1)}>click</Button>
    </>
  );
}
