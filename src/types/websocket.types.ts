export enum WebSocketEventType{
    NEW_MESSAGE = 'new_message',
    ERROR = 'error',
    PING = 'ping',
    PONG = 'pong',
    READ = 'read',
    TYPING = 'typing',
    HISTORY = 'history'
}

export interface WebSocketEvent {
    type: WebSocketEventType;
    payload: any;
}