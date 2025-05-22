"use client";

import { usePost } from "./query/get";

export default function Home() {
  const { mutate } = usePost();

  const handleClick = () => {
    mutate({
      title: "새로운 게시물",
      body: "게시물 내용입니다.",
      userId: 1,
    });
  };

  return (
    <div>
      <button onClick={handleClick}>클릭</button>
    </div>
  );
}
