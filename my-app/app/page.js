"use client";
import { Button } from "@/components/ui/button";
import ChatBox from "@/components/ui/chat/chat-box";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useEffect, useState } from "react";
export default function Home() {
  const [link, setLink] = useState("");
  const [questionSlug, setQuestionSlug] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    const items = localStorage.getItem("questionSlug");
    if (items) {
      setQuestionSlug(items);
      setLink("https://leetcode.com/problems/" + items);
      setLoaded(true);
    }
    getALlConversations();
  }, [link]);

  function getQuestionSlug() {
    const res = link.split("/");
    try {
      res.map((item, index) => {
        if (item.includes("problems")) {
          setQuestionSlug(res[index + 1]);
        }
      });
      localStorage.setItem("questionSlug", questionSlug);
      setLoaded(true);
    } catch (error) {
      console.log(error);
    }
  }
  function deleteQuestionSlug() {
    localStorage.removeItem("questionSlug");
    setQuestionSlug("");
    setLoaded(false);
  }
  function getTextBeforeLastDash(text) {
    // Remove characters before the first two dashes
    const firstDashIndex = text.indexOf("-");
    const secondDashIndex = text.indexOf("-", firstDashIndex + 1);
    if (secondDashIndex !== -1) {
      text = text.substring(secondDashIndex + 1);
    }

    // Remove text after the last dash
    const lastDashIndex = text.lastIndexOf("-");
    if (lastDashIndex !== -1) {
      text = text.substring(0, lastDashIndex);
    }

    return text;
  }
  function handleConversationClick(id) {
    const newId = getTextBeforeLastDash(id);
    setQuestionSlug(newId);
    setLink("https://leetcode.com/problems/" + newId);
    localStorage.setItem("questionSlug", newId);
    setLoaded(true);
  }
  function getALlConversations() {
    const data = JSON.stringify({
      user_id: "guest",
    });
    let config = {
      method: "POST",
      url: process.env.NEXT_PUBLIC_BACKEND_URL + "get-prev-conversations",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        setConversations(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="flex h-screen w-screen p-10 flex-row">
      <div className="w-1/4 h-full outline rounded mr-5">
        <p1 className="text-center w-full text-sm p-2">Logged in as guest</p1>
        {conversations.map((item, index) => {
          return (
            <div
              key={item.id}
              className="w-full  flex items-center justify-center p-4  whitespace-nowrap border-gray-200"
            >
              <div
                className="text-md overflow-hidden text-ellipsis cursor-pointer rounded hover:bg-gray-200 p-1 transition-all \"
                onClick={() => handleConversationClick(item.id)}
              >
                {item.id}
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-3/4">
        <div className="w-full h-20">
          <div className="flex w-full  items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter Leetcode Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={loaded}
            />
            <Button type="submit" onClick={getQuestionSlug}>
              Submit
            </Button>
            <Button
              type="submit"
              variant="outline"
              onClick={deleteQuestionSlug}
            >
              New Chat
            </Button>
          </div>
        </div>
        <div className="w-full h-3/4">
          <ChatBox questionSlug={questionSlug}></ChatBox>
        </div>
      </div>
    </div>
  );
}
