import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { supportChat } from "@/configs/constants/constants";
import useUserStore from "../store/userStore";
import { MdClose, MdSend, MdSupportAgent, MdPerson } from "react-icons/md";

const faqData = [
  {
    question: "Как оформить заказ?",
    answer:
      "Чтобы оформить заказ, выполните следующие шаги:\n1. Выберите нужные товары на сайте.\n2. Добавьте их в корзину.\n3. Перейдите в корзину и оформите покупку, следуя инструкциям.",
  },
  {
    question: "Где мой заказ?",
    answer:
      "Вы можете отследить статус вашего заказа в личном кабинете:\n1. Перейдите в раздел 'Мои заказы'.\n2. Найдите нужный заказ и проверьте его статус.\nЕсли у вас возникли вопросы, свяжитесь с нашей поддержкой.",
  },
  {
    question: "Как вернуть товар?",
    answer:
      "Для возврата товара:\n1. Свяжитесь с нашей службой поддержки через чат или по телефону.\n2. Укажите номер вашего заказа.\n3. Следуйте инструкциям специалиста для оформления возврата.",
  },
  {
    question: "Узнать стоимость доставки?",
    answer:
      "Стоимость доставки зависит от региона и условий заказа:\n- При оформлении полного сертификата на выдачу технических средств реабилитации (ТСР) стоимость заказа включает цену товаров и доставку до вашего региона.\n- При заказе отдельных ТСР уточняйте стоимость доставки у специалиста в чате.\n\nДоступные способы доставки:\n- Транспортные компании: ПЭК, СДЭК\n- Курьерская доставка\n- Почта России\n- Собственная логистика или другие варианты\n\nСтоимость доставки рассчитывается в зависимости от региона. При доставке через СДЭК учитывается общий вес заказа. Точную стоимость вы увидите на странице оформления заказа после выбора региона.",
  },
  {
    question: "Как оплатить сертификатом?",
    answer:
      "Для оплата электронным сертификатом следуйте этим шагам:\n1. Выберите товар и регион на сайте — отобразится цена с учетом сертификата.\n2. Добавьте товар в корзину и укажите количество.\n3. Перейдите к оплате, выбрав 'Оплата электронным сертификатом'.\n4. Введите данные карты МИР, привязанной к сертификату, и нажмите 'Найти сертификат'.\n5. Убедитесь, что сертификат найден, и введите код из SMS от банка для завершения оплаты.\n\nВажно:\n- Если сертификат не найден или указано 'Оплата банковской картой', проверьте данные.\n- Если цена товара фиксированная (не зависит от региона), может потребоваться доплата с той же карты МИР.\n\nПри возникновении вопросов обратитесь в чат поддержки или по телефону. Режим работы поддержки: с 9:00 до 18:00. Вы можете оставить свои контактные данные (имя, телефон), и наш специалист свяжется с вами в рабочее время.",
  },
];

const CHAT_ID_EXPIRY_MS = 5 * 60 * 60 * 1000; // 5 часов
const MESSAGE_GAP = 5 * 60 * 1000; // 5 минут

function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const processedMessages = useRef(new Set());
  const { isAuthenticated } = useUserStore();
  const shownBotMessages = useRef(new Set());
  const hasShownFaq = useRef(false); // Флаг для отслеживания показа FAQ

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  };

  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  const normalizeTimestamp = (timestamp) => new Date(timestamp).toISOString();

  const sendJoinEvent = (chatId) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      setError("Нет соединения с сервером чата.");
      return;
    }
    const joinEvent = { event: "join", data: { chat_id: chatId } };
    ws.current.send(JSON.stringify(joinEvent));
  };

  const addBotMessageIfNotShown = (text) => {
    if (!shownBotMessages.current.has(text)) {
      shownBotMessages.current.add(text);
      return {
        type: "bot",
        text: text,
        timestamp: new Date().toISOString(),
        senderId: "bot",
      };
    }
    return null;
  };

  // Функция для добавления FAQ только один раз
  const addFaqIfNotShown = () => {
    if (!hasShownFaq.current) {
      hasShownFaq.current = true;
      return { type: "faq", timestamp: new Date().toISOString() };
    }
    return null;
  };

  useEffect(() => {
    let newChatId = null;

    if (isAuthenticated) {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          newChatId = parsedUser?.data?.id || generateUUID();
        } catch {
          newChatId = generateUUID();
        }
      } else {
        newChatId = generateUUID();
      }
    } else {
      let sessionId = Cookies.get("session_id");
      if (!sessionId) {
        sessionId = generateUUID();
        Cookies.set("session_id", sessionId, { expires: 1 });
      }
      newChatId = sessionId;
    }

    setChatId(newChatId);

    // Добавляем авто-сообщение бота и FAQ только один раз при открытии
    const welcomeMessage = addBotMessageIfNotShown(
      "Рабочий режим специалистов поддержки с 9 до 18.00, ПН по ПТ. Вы можете оставить свои контактные данные (имя, телефон), задать вопрос и наш специалист свяжется с Вами в рабочее время."
    );

    const faqMessage = addFaqIfNotShown();

    const initialMessages = [];
    if (welcomeMessage) initialMessages.push(welcomeMessage);
    if (faqMessage) initialMessages.push(faqMessage);

    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }

    ws.current = new WebSocket(supportChat);

    ws.current.onopen = () => {
      setIsConnected(true);
      setError("");
      if (newChatId) sendJoinEvent(newChatId);
    };

    ws.current.onmessage = (event) => {
      if (!isValidJSON(event.data)) {
        const messageKey = `${event.data}-${new Date().toISOString()}`;
        if (processedMessages.current.has(messageKey)) return;
        processedMessages.current.add(messageKey);
        setMessages((prev) => {
          const botMessages = prev.filter((m) => m.type === "bot");
          const otherMessages = prev.filter((m) => m.type !== "bot");

          return [
            ...botMessages,
            ...otherMessages,
            {
              type: "manager",
              text: String(event.data),
              timestamp: new Date().toISOString(),
              senderId: `manager-${Date.now()}`,
              isNew: true,
            },
          ];
        });
        return;
      }

      try {
        const messageData = JSON.parse(event.data);

        if (Array.isArray(messageData)) {
          const formattedMessages = messageData.map((msg) => ({
            type: msg.sender_id !== chatId ? "manager" : "user",
            text: msg.message || "Пустое сообщение",
            timestamp: normalizeTimestamp(msg.time_to_send || new Date()),
            senderId: msg.sender_id,
            id: msg.id,
          }));

          setMessages((prev) => {
            const botMessages = prev.filter((m) => m.type === "bot");
            const otherMessages = prev.filter((m) => m.type !== "bot");
            return [...botMessages, ...otherMessages, ...formattedMessages];
          });
        } else if (messageData.event === "message-event") {
          const { message, sender_id, time_to_send, id } = messageData.data;
          const messageKey = `${chatId}-${message}-${
            time_to_send || new Date().toISOString()
          }`;
          if (processedMessages.current.has(messageKey)) return;
          processedMessages.current.add(messageKey);

          setMessages((prev) => {
            const botMessages = prev.filter((m) => m.type === "bot");
            const otherMessages = prev.filter((m) => m.type !== "bot");

            return [
              ...botMessages,
              ...otherMessages,
              {
                type: sender_id !== chatId ? "manager" : "user",
                text: message || "Пустое сообщение",
                timestamp: normalizeTimestamp(time_to_send || new Date()),
                senderId: sender_id,
                isNew: true,
                id,
              },
            ];
          });

          if (sender_id !== chatId && "Notification" in window) {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                new Notification("Новое сообщение от поддержки", {
                  body:
                    message.slice(0, 50) + (message.length > 50 ? "..." : ""),
                });
              }
            });
          }

          setTimeout(() => {
            setMessages((prev) =>
              prev.map((msg) => (msg.isNew ? { ...msg, isNew: false } : msg))
            );
          }, 1000);
        } else if (messageData.event === "error") {
          setError(`Ошибка: ${messageData.data}`);
          const errorMessage = addBotMessageIfNotShown(
            `Ошибка: ${messageData.data}`
          );
          if (errorMessage) {
            setMessages((prev) => {
              const botMessages = prev.filter((m) => m.type === "bot");
              const otherMessages = prev.filter((m) => m.type !== "bot");

              return [...botMessages, ...otherMessages, errorMessage];
            });
          }
        }
      } catch (err) {
        setError("Ошибка обработки сообщения от сервера.");
      }
    };

    ws.current.onerror = () => {
      setIsConnected(false);
      setError("Ошибка подключения к чату.");
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      setError("Соединение с чатом разорвано.");
    };

    if ("Notification" in window) {
      Notification.requestPermission();
    }

    return () => {
      ws.current?.close();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      setError("Нет соединения с сервером чата.");
      const errorMessage = addBotMessageIfNotShown(
        "Нет соединения с сервером чата."
      );
      if (errorMessage) {
        setMessages((prev) => {
          const botMessages = prev.filter((m) => m.type === "bot");
          const otherMessages = prev.filter((m) => m.type !== "bot");

          return [...botMessages, ...otherMessages, errorMessage];
        });
      }
      return;
    }
    const trimmedInput = input.trim();
    if (trimmedInput && chatId) {
      const messageEvent = {
        event: "message-event",
        data: { message: trimmedInput, chat_id: chatId },
      };
      ws.current.send(JSON.stringify(messageEvent));
      setMessages((prev) => {
        const botMessages = prev.filter((m) => m.type === "bot");
        const otherMessages = prev.filter((m) => m.type !== "bot");

        return [
          ...botMessages,
          ...otherMessages,
          {
            type: "user",
            text: trimmedInput,
            timestamp: new Date().toISOString(),
            senderId: chatId,
            isNew: true,
          },
        ];
      });
      setInput("");
    }
  };

  const handleFAQClick = (answer) => {
    const botMessage = addBotMessageIfNotShown(answer);
    if (botMessage) {
      setMessages((prev) => {
        const botMessages = prev.filter((m) => m.type === "bot");
        const otherMessages = prev.filter((m) => m.type !== "bot");

        return [...botMessages, ...otherMessages, botMessage];
      });
    }
  };

  const renderMessages = () => {
    const elements = [];

    messages.forEach((msg, index) => {
      if (msg.type === "bot") {
        elements.push(
          <div
            key={`bot-${msg.timestamp}-${index}`}
            className="text-left mb-4 bg-purple-100 p-3 rounded-lg max-w-[80%] mx-auto shadow-sm"
          >
            <p className="text-sm text-gray-900 whitespace-pre-line">
              {msg.text}
            </p>
            <span className="block mt-1 text-gray-500 text-xs text-right">
              {new Date(msg.timestamp).toLocaleString(undefined, {
                timeStyle: "short",
              })}
            </span>
          </div>
        );
      } else if (msg.type === "faq") {
        elements.push(
          <div
            key={`faq-${msg.timestamp}-${index}`}
            className="flex flex-wrap justify-center mb-4 px-2 bg-gray-50"
          >
            {faqData.map((faq, idx) => (
              <button
                key={idx}
                onClick={() => handleFAQClick(faq.answer)}
                className="m-1 px-3 py-1 bg-purple-100 text-purple-600 text-sm rounded-full hover:bg-purple-500 hover:text-white transition-colors shadow-sm"
              >
                {faq.question}
              </button>
            ))}
          </div>
        );
      } else {
        const prevMsg = messages[index - 1];
        const nextMsg = messages[index + 1];
        const timeDiff = prevMsg
          ? new Date(msg.timestamp) - new Date(prevMsg.timestamp)
          : Infinity;
        const isFirst =
          !prevMsg ||
          prevMsg.senderId !== msg.senderId ||
          timeDiff > MESSAGE_GAP;
        const isLast =
          !nextMsg ||
          nextMsg.senderId !== msg.senderId ||
          new Date(nextMsg.timestamp) - new Date(msg.timestamp) > MESSAGE_GAP;

        const isUser = msg.senderId === chatId;
        const alignment = isUser ? "justify-end" : "justify-start";

        elements.push(
          <div
            key={`msg-row-${msg.timestamp}-${index}`}
            className={`flex ${alignment} items-end mb-${
              isLast ? "4" : "1"
            } px-2`}
          >
            {!isUser && isFirst && (
              <div className="mr-2 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                <MdSupportAgent className="text-white text-lg" />
              </div>
            )}
            {!isUser && !isFirst && <div className="w-10 shrink-0" />}
            <div
              className={`${
                isUser ? "bg-purple-500 text-white" : "bg-white text-gray-900"
              } p-3 max-w-full rounded-lg shadow-sm flex flex-col`}
            >
              <p className="text-sm leading-tight break-words">{msg.text}</p>
              {isLast && (
                <span
                  className={`mt-1 ${
                    isUser ? "text-purple-200" : "text-gray-500"
                  } text-xs flex items-center ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleString(undefined, {
                    timeStyle: "short",
                  })}
                </span>
              )}
            </div>
            {isUser && isLast && (
              <div className="ml-2 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                <MdPerson className="text-white text-lg" />
              </div>
            )}
          </div>
        );
      }
    });

    return elements;
  };

  return (
    <div className="fixed bottom-20 right-4 w-[90%] sm:w-96 h-[70vh] sm:h-[500px] flex flex-col rounded-xl overflow-hidden bg-white z-50 shadow-2xl">
      <div className="bg-purple-500 p-2 flex items-center justify-between">
        <p className="text-white font-medium text-lg ml-2">Чат поддержки</p>
        <button onClick={onClose} className="text-white">
          <MdClose className="text-xl" />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-600 text-sm">{error}</div>
      )}

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-2 border-t border-gray-200 flex items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border border-gray-300 rounded-lg bg-gray-100 p-2 text-sm text-gray-900 placeholder-gray-500 focus:border-purple-500 outline-none disabled:opacity-50"
          placeholder="Сообщение..."
          disabled={!chatId || !isConnected}
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white p-2 min-w-[36px] disabled:opacity-50 transition-colors shadow-sm"
          disabled={!chatId || !isConnected}
        >
          <MdSend className="text-xl" />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
