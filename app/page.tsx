import { Calculator } from "@/components/calculator";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <Calculator />
        </div>
      </main>
    </div>
  );
}
