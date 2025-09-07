import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const numberVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const logoVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, delay: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#F5FCFF] to-[#A5DED1] overflow-hidden">
      {/* Фоновые круги */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,_#2CC0B3,_transparent)] z-0"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[15%] right-[25%] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,_#00B3A4,_transparent)] z-0"
      />

      {/* Контент */}
      <motion.div
        variants={numberVariants}
        initial="hidden"
        animate="visible"
        className="z-10"
      >
        <h1 className="text-6xl md:text-9xl font-bold text-[#2CC0B3] drop-shadow-md">
          404
        </h1>
      </motion.div>

      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        className="z-10 mt-4"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-[#00B3A4] tracking-widest">
          Sdmedik.ru
        </h2>
      </motion.div>

      <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        className="z-10 mt-4 max-w-xl text-center"
      >
        <p className="text-base md:text-lg text-gray-800">
          Ой! Кажется, мы заблудились. Страница, которую вы ищете, не найдена.
        </p>
      </motion.div>

      <motion.button
        whileHover={{
          scale: 1.1,
          boxShadow: "0px 4px 20px rgba(44, 192, 179, 0.5)",
        }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate("/")}
        className="z-10 mt-6 bg-[#2CC0B3] hover:bg-[#00B3A4] text-white px-6 py-3 rounded-full text-lg"
      >
        Вернуться на главную
      </motion.button>
    </div>
  );
}
