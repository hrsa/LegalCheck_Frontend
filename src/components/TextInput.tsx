import {TextInput as TextInputOriginal, TextInputProps} from "react-native";

export default function TextInput({className, ...props}: TextInputProps & { className?: string}) {
    const defaultStyles = "border border-gray-600 rounded-md px-4 py-2 h-10 focus:outline-none focus:ring-1 focus:ring-blue-400";
    return (
        <TextInputOriginal
            className={`${defaultStyles} ${className || ""}`}
            {...props}
        />
    );
}
