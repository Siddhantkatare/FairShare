import { useParams, useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users, PieChart, Info, SendHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { loggedData, SOCKET_URL, ToastProperty } from "../lib/config";
import { getGroupById, sendMessage } from "../api/groupApi";
import { toast } from "react-toastify";

const socket = io(SOCKET_URL, {
  secure: true,
  path: "/socket.io",
  transports: ["websocket", "polling"],
});

const GroupDetail = () => {
  const loginData = loggedData();
  const [messages, setMessages] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState({})
  const [input, setInput] = useState("");


  if (!group) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Group Not Found</h2>
          <p className="text-muted-foreground mb-6">The group you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/groups")}>
            Back to Groups
          </Button>
        </div>
      </AppLayout>
    );
  }

  const getGroup = async () => {
    const response = await getGroupById(loginData.token, id);
    if (response.success) {
      setGroup(response.group)
    } else {
      toast.error(response.message, ToastProperty)
    }
  }

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      console.log("receiveMessage", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (group && group.conversation !== undefined) {
      setMessages(group.conversation);
    }
  }, [group]);

  useEffect(() => {
    getGroup();
  }, [])

  const getTimeDifference = (date) => {
    const now = moment();
    const postDate = moment(date);
    const diffInMinutes = now.diff(postDate, "minutes");
    const diffInHours = now.diff(postDate, "hours");
    const diffInDays = now.diff(postDate, "days");

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes === 1 && diffInMinutes < 60) return `${diffInMinutes} minute ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${diffInDays} days ago`;
  };

  const handleSend = async () => {
    if (input.trim()) {
      // console.log(input)
      const newMessage = {
        sender: loginData.email,
        name: loginData.name,
        message: input,
        createdAt: new Date().toISOString(),
      };
      socket.emit("sendMessage", newMessage);
      setInput("");
      const response = await sendMessage(loginData.token, group.id, newMessage)
      if (response.success === false) {
        toast.error(response.message, ToastProperty)
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row p-4 h-[1100px] md:h-[550px] gap-3"
      >
        {/* Left Panel */}
        <div className="p-4 w-full md:w-2/5 lg:w-1/4 h-1/2 md:h-full rounded shadow-md flex flex-col gap-4 bg-white">
          <Link to="/groups">
            <button className="w-full py-2 px-4 bg-black text-white rounded capitalize transition">
              Back
            </button>
          </Link>

          <div className="border border-gray-300 rounded bg-gray-100 overflow-hidden">
            <div className="p-2">Group Name</div>
            <div className="bg-white p-2">{group.name || "N/A"}</div>
          </div>

          <div className="border border-gray-300 rounded bg-gray-100 overflow-hidden">
            <div className="p-2">Description</div>
            <div className="bg-white p-2">{group.description || "N/A"}</div>
          </div>

          <div className="border border-gray-300 rounded bg-gray-100 overflow-hidden">
            <div className="p-2">Admin</div>
            <div className="bg-white p-2">{group && group.createdBy ? group.createdBy.name || group.createdBy.email : "N/A"}</div>
          </div>

          <div className="border border-gray-300 rounded bg-gray-100 overflow-hidden">
            <div className="p-2">Members :</div>
            <div className="bg-white p-2 max-h-[135px] overflow-y-auto">
              {group?.members?.length ? (
                group.members.map(m => (
                  <div key={m.email}>{m.name || m.email}</div>
                ))
              ) : "N/A"}

            </div>
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div className="p-4 w-full md:w-3/5 lg:w-3/4 h-1/2 md:h-full rounded shadow-md flex flex-col gap-2 bg-white">
          <div className={`flex-grow h-[85%] overflow-y-auto flex flex-col-reverse gap-4 rounded-lg`}>
            {[...messages].reverse().map((message, index) => {
              const currentProfile = message.sender === loginData.email;
              return (
                <div
                  key={index}
                  className={`shadow-md ${currentProfile ? 'bg-black text-white' : 'bg-gray-200'} max-w-[70%] rounded-lg px-4 py-2 flex flex-col ${currentProfile ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <span className="font-semibold">
                    {currentProfile ? "You" : message.name || message.sender}
                  </span>
                  <p className="text-left">{message.message}</p>
                  <span className="text-xs cursor-pointer" title={moment(message.createdAt).format("lll")}>
                    {getTimeDifference(message.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="relative w-full">
            <input
              type="text"
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              placeholder="Type a message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSend}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
            >
              <SendHorizontal />
            </button>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default GroupDetail;