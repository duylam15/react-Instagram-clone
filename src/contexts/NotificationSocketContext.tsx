import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
  } from "react";
  import SockJS from "sockjs-client";
  import { CompatClient, Stomp } from "@stomp/stompjs";
  
  interface Notification {
    id?: number;
    content: string;
    [key: string]: any;
  }
  
  interface NotificationSocketContextProps {
    stompClient: React.MutableRefObject<CompatClient | null>;
    notificationsWebsocket: Notification[];
    setNotificationsWebsocket: React.Dispatch<React.SetStateAction<Notification[]>>;
  }
  
  const NotificationSocketContext = createContext<NotificationSocketContextProps | null>(null);
  
  export const useNotificationSocket = (): NotificationSocketContextProps => {
    const context = useContext(NotificationSocketContext);
    if (!context) {
      throw new Error("useNotificationSocket must be used within a NotificationSocketProvider");
    }
    return context;
  };
  
  interface NotificationSocketProviderProps {
    userId: number;
    children: ReactNode;
  }
  
  export const NotificationSocketProvider: React.FC<NotificationSocketProviderProps> = ({
    userId,
    children,
  }) => {
    const stompClient = useRef<CompatClient | null>(null);
    const [notificationsWebsocket, setNotificationsWebsocket] = useState<Notification[]>([]);
  
    useEffect(() => {
      if (!userId) return;
  
      const socket = new SockJS("http://localhost:9999/api/ws-notification");
      const client = Stomp.over(socket);
  
      client.connect({}, () => {
        console.log("✅ Socket connected notification");
  
        client.subscribe(`/topic/notify-${userId}`, (msg) => {
          const body: Notification = JSON.parse(msg.body);
          console.log("📩 Received notification:", body);
          setNotificationsWebsocket((prev) => [body, ...prev]); // Lưu vào state
        });
      });
  
      stompClient.current = client;
  
      return () => {
        stompClient.current?.disconnect(() => {
          console.log("🔌 Socket disconnected notification");
        });
      };
    }, [userId]);
  
    return (
      <NotificationSocketContext.Provider
        value={{ stompClient, notificationsWebsocket, setNotificationsWebsocket }}
      >
        {children}
      </NotificationSocketContext.Provider>
    );
  };