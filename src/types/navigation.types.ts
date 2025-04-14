export type IoniconsName =
    | "search" | "repeat" | "link" | "at" | "body" | "code" | "map" | "menu" | "time"
    | "ellipse" | "filter" | "image" | "stop" | "text" | "alert" | "checkbox" | "radio"
    | "timer" | "close" | "home" | "home-outline" | "document-text-outline" | "menu-outline" | "list-outline"
    | "person-outline";


export interface NavigationItem {
    title: string;
    path: string;
    icon: IoniconsName;
}
