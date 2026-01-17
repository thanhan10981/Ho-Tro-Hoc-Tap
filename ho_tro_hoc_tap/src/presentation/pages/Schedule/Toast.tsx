import "../../../styles/Schedule/Toast.css"

interface Props {
  message: string;
  type?: "success" | "error";
}

export default function Toast({ message, type = "success" }: Props) {
  return <div className={`toast ${type}`}>{message}</div>;
}
