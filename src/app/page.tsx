import { redirect } from "next/navigation";

export default function Home() {
  // Sempre leva para a tela de login ao acessar a raiz da aplicação
  redirect("/login");
}
