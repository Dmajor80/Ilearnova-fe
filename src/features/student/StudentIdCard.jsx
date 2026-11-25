import { User } from "lucide-react";

/** The student roles in a profile, one per school. */
const studentCards = (user) =>
  (user?.organizations || []).flatMap(({ organization, roles }) =>
    (roles || [])
      .filter((role) => role.code === "student")
      .map((role) => ({ organization, role }))
  );

function Card({ user, organization, role }) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || user.email;
  const photo = user.profile_pic || user.profile_picture;
  return (
    <article
      aria-label={`${organization.name} student ID card`}
      className="w-full max-w-sm overflow-hidden rounded-2xl border bg-white shadow-md"
    >
      <header className="bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-3 text-white">
        <p className="text-xs uppercase tracking-wider text-blue-100">Student ID card</p>
        <h3 className="truncate text-lg font-bold">{organization.name}</h3>
      </header>
      <div className="flex gap-4 p-4">
        <div className="flex h-24 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
          {photo ? (
            <img src={photo} alt={name} className="h-full w-full object-cover" />
          ) : (
            <User className="h-10 w-10 text-slate-400" aria-hidden="true" />
          )}
        </div>
        <dl className="min-w-0 space-y-1 text-sm">
          <div>
            <dt className="sr-only">Name</dt>
            <dd className="truncate text-base font-semibold text-gray-900">{name}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-gray-500">Admission no.</dt>
            <dd className="font-medium text-gray-900">{role.student_id || "Not set"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-gray-500">Class</dt>
            <dd className="font-medium text-gray-900">{role.class_name || "Not assigned"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-gray-500">Status</dt>
            <dd className={role.is_verified ? "font-medium text-green-700" : "font-medium text-amber-700"}>
              {role.is_verified ? "Verified" : "Awaiting school verification"}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

/**
 * A student's ID card for each school they attend, built from their profile
 * (name, photo, admission number, class). Nothing for non-students.
 */
export default function StudentIdCard({ user, className = "" }) {
  const cards = studentCards(user);
  if (!cards.length) return null;
  return (
    <section className={`space-y-3 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900">ID card{cards.length > 1 ? "s" : ""}</h2>
      <div className="flex flex-wrap gap-4">
        {cards.map(({ organization, role }) => (
          <Card key={organization.id} user={user} organization={organization} role={role} />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Your admission number and class come from your school. Ask the school office if either is missing.
      </p>
    </section>
  );
}
