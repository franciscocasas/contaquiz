import { notFound } from "next/navigation";
import { getGame } from "@/lib/games";
import { GameShell } from "@/components/GameShell";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  return <GameShell game={game} />;
}

export async function generateStaticParams() {
  return [
    { slug: "naturaleza" },
    { slug: "permutativo" },
    { slug: "estado" },
    { slug: "asientos" },
    { slug: "mayor" },
  ];
}
