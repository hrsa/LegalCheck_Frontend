import { settings } from "./config";
import { getToken } from "./auth";
import {WebSocketEventType} from "../../types/websocket.types";

// Define event handlers type
type MessageHandler = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private messageHandlers: Map<WebSocketEventType, MessageHandler[]> = new Map();
  private connectionId: number | null = null;

  // Connect to WebSocket
  async connect(conversationId: number): Promise<boolean> {
    // If already connected to this conversation, return
    if (this.isConnected && this.connectionId === conversationId) {
      console.log('WebSocket already connected to this conversation');
      return true;
    }

    // If connecting, wait
    if (this.isConnecting) {
      console.log('WebSocket connection in progress');
      return false;
    }

    if (this.socket) {
      console.log('Disconnecting from previous WebSocket before connecting to new one');
      await this.disconnect();
    }

    this.isConnecting = true;
    this.connectionId = conversationId;

    try {
      const wsUrl = await this.getWebSocketUrl(conversationId);
      if (!wsUrl) {
        this.isConnecting = false;
        this.connectionId = null;
        return false;
      }

      console.log('Connecting to WebSocket:', wsUrl);

      // Create a new WebSocket connection
      this.socket = new WebSocket(wsUrl);

      // Set up a promise that resolves when the connection is established or rejects on error
      const connectionPromise = new Promise<boolean>((resolve, reject) => {
        const onOpen = () => {
          console.log('WebSocket connection established');
          this.isConnected = true;
          this.isConnecting = false;
          resolve(true);
        };

        const onError = (event: Event) => {
          console.error('WebSocket connection error:', event);
          this.isConnected = false;
          this.isConnecting = false;
          this.connectionId = null;
          reject(new Error('Failed to connect to WebSocket'));
        };

        // Add one-time event listeners
        this.socket!.addEventListener('open', onOpen, { once: true });
        this.socket!.addEventListener('error', onError, { once: true });
      });

      // Set up the regular event handlers
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onerror = this.handleError.bind(this);
      this.socket.onclose = this.handleClose.bind(this);

      // Note: We don't set this.socket.onopen because we're using the one-time event listener above

      // Wait for the connection to be established with a timeout
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => reject(new Error('WebSocket connection timeout')), 5000);
      });

      // Wait for either the connection to be established or the timeout to occur
      return await Promise.race([connectionPromise, timeoutPromise]);
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.isConnected = false;
      this.isConnecting = false;
      this.connectionId = null;
      return false;
    }
  }

  // Clear all event handlers
  clearEventHandlers(): void {
    this.messageHandlers.clear();
  }

  // Disconnect from WebSocket
  disconnect(): Promise<void> {
    return new Promise<void>((resolve) => {
      // Clear all event handlers
      this.clearEventHandlers();

      if (!this.socket) {
        this.isConnected = false;
        this.isConnecting = false;
        this.connectionId = null;
        resolve();
        return;
      }

      // If the socket is already closed or closing, just resolve
      if (this.socket.readyState === WebSocket.CLOSED || this.socket.readyState === WebSocket.CLOSING) {
        this.socket = null;
        this.isConnected = false;
        this.isConnecting = false;
        this.connectionId = null;
        resolve();
        return;
      }

      // Set up a one-time close handler that will resolve the promise
      const onClose = () => {
        console.log('WebSocket disconnected successfully');
        this.socket = null;
        this.isConnected = false;
        this.isConnecting = false;
        this.connectionId = null;
        resolve();
      };

      // Add a temporary onclose handler
      this.socket.addEventListener('close', onClose, { once: true });

      // Close the socket
      this.socket.close();
    });
  }

  // Check if connected
  isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Add event handler
  on(type: WebSocketEventType, handler: MessageHandler): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)?.push(handler);
  }

  // Remove event handler
  off(type: WebSocketEventType, handler: MessageHandler): void {
    if (!this.messageHandlers.has(type)) return;

    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Send message
  send(data: any): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.send(JSON.stringify(data));
  }

  private async getWebSocketUrl(conversationId: number): Promise<string | null> {
    let wsUrl = '';

    if (!settings.MOBILE_PLATFORM) {
      wsUrl = `${settings.WS_API_URL}/conversations/${conversationId}`;
    } else {
      const token = await getToken();
      if (!token) {
        console.error('No authentication token found');
        return null;
      }
      wsUrl = `${settings.WS_API_URL}/conversations/${conversationId}?token=${encodeURIComponent(token)}`;
    }

    console.log('WebSocket URL:', wsUrl);
    console.log('Settings Websocket URL:', settings.WS_API_URL);

    return wsUrl;
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data);
      console.log('Received WebSocket message:', message);

      // Call all handlers for this message type
      const messageType = message.type as WebSocketEventType;
      const handlers = this.messageHandlers.get(messageType);
      if (handlers) {
        handlers.forEach(handler => handler(message.payload));
      } else {
        console.warn(`No handlers registered for message type: ${messageType}`);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
    this.isConnected = false;
  }

  private handleClose(): void {
    console.log('WebSocket connection closed');
    this.isConnected = false;
    this.isConnecting = false;
  }
}

export const websocketService = new WebSocketService();

export default websocketService;
