import { useRouter } from "next/router";

export default function Home() {
  useRouter().replace("/login");

  return <div></div>;
}
