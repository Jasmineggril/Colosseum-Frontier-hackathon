import DreamAnalysis from "@/components/DreamAnalysis";
import { Link } from "wouter";

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dream Analysis</h1>
          <Link href="/dashboard" className="text-sm text-muted-foreground underline">Go to Dashboard</Link>
        </div>

        <DreamAnalysis />
      </div>
    </div>
  );
}
