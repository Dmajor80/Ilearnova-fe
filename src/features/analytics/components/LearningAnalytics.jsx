import { BarChart3 } from "lucide-react";

export default function LearningAnalytics() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <section className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <BarChart3 className="text-blue-700" />
          Learning analytics
        </h1>
        <p className="mt-3 text-gray-600">
          Analytics are available from the dashboard for your account role.
        </p>
      </section>
    </main>
  );
}
