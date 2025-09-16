"use client";
import { useEffect, useState } from "react";

export default function ErrorPage({ error }: { error: Error }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage(error?.message || "Something went wrong");
  }, [error]);

  return <h1>Error: {message}</h1>;
}
