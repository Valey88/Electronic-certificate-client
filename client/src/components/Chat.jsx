import React, { useState } from "react";
import { MdChat } from "react-icons/md";
import ChatWindow from "./ChatWindow";

function Chat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="fixed bottom-4 right-4 bg-purple-500 text-white font-medium text-sm py-2 px-4 rounded-full flex items-center gap-2 hover:bg-purple-600 transition-colors shadow-md"
        onClick={() => setIsOpen(true)}
      >
        Напишите нам, мы онлайн
        <MdChat className="text-lg" />
      </button>
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default Chat;
