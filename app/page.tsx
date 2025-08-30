import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Flag Quiz</h1>
      <Link href="/quiz">
        <button className="px-6 py-2 bg-green-500 text-black rounded-lg">
          Start Quiz
        </button>
      </Link>
    </div>
  );
}
