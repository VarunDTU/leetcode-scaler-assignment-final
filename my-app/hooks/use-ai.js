"use client";
import axios from "axios";
import { useEffect, useState } from "react";
export function useChat(props) {
  const { questionSlug } = props;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchOldData() {
      let data = JSON.stringify({
        problem_slug: questionSlug,
        user_id: "guest",
      });

      let config = {
        method: "POST",
        url: process.env.NEXT_PUBLIC_BACKEND_URL + "get-prev-messages",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios
        .request(config)
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    fetchOldData();
  }, [questionSlug]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let data = JSON.stringify({
      messages: input,
      user_id: "guest",
      problem_slug: questionSlug,
    });

    let config = {
      method: "POST",
      url: process.env.NEXT_PUBLIC_BACKEND_URL + "chat",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    setMessages((prev) => [...prev, { content: input, role: "user" }]);
    await axios
      .request(config)
      .then((response) => {
        const res = response.data;
        console.log(typeof res);
        console.log(res);

        setMessages((prev) => [...prev, { content: res, role: "assistant" }]);
        setInput("");
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setInput("");
        setIsLoading(false);
      });
  };

  const append = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const stop = () => {
    setIsLoading(false);
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    isLoading,
  };
}
