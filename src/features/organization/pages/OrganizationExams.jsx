import React from "react";
import { AlertTriangle } from "lucide-react";

const OrganizationExams = () => (
  <section className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm md:p-6">
    <div className="flex items-start gap-3">
      <span className="rounded-lg bg-amber-100 p-2 text-amber-700">
        <AlertTriangle className="h-5 w-5" />
      </span>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Exam management is unavailable</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          The organization-admin API specification does not define exam endpoints. The available
          exam management routes are scoped to teachers, so this page does not call them using an
          organization-admin account.
        </p>
      </div>
    </div>
  </section>
);

export default OrganizationExams;
