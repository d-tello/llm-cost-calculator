import { Calculator } from "@/components/calculator";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <h1 className="mb-6 text-center text-3xl font-bold tracking-tight">
            LLM Cost Calculator
          </h1>
          <p className="mb-8 text-center text-muted-foreground">
            Calculate the cost of using Large Language Models for your applications
          </p>
          <Calculator />
        </div>
      </main>
    </div>
  );
}
