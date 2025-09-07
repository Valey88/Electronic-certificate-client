import React, { useState, useRef } from "react";
import PhoneIcon from "@mui/icons-material/Phone";

const ContactMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleClick = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="relative">
      <button
        ref={anchorRef}
        onClick={handleClick}
        className="text-purple-600 hover:text-purple-800"
        aria-label="contact"
      >
        <PhoneIcon className="w-8 h-8" />
      </button>
      {isOpen && (
        <div className="absolute top-8 right--20 bg-white shadow-xl rounded-lg z-50 min-w-[220px] p-4 border border-purple-100">
          <button
            onClick={handleClose}
            className="w-full text-left text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-md"
          >
            +7 (903) 086 3091
          </button>
          <button
            onClick={handleClose}
            className="w-full text-left text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-md"
          >
            +7 (353) 293 5241
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactMenu;
