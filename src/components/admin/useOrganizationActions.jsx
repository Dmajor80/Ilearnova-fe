import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Eye, LogIn, Pencil, Power, PowerOff, Trash2, UserPlus, Users } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import DeleteDialog from "@/components/ui/DeleteDialog";
import { superAdminApi } from "@/api/superAdminApi";
import { startManagingSchool } from "@/lib/manageSchool";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { toast } from "@/lib/toast";
import OrganizationFormModal from "./OrganizationFormModal";
import RenewSubscriptionDialog from "./RenewSubscriptionDialog";

const errorText = (err) => apiErrorDetails(err).messages.join(" ");

/**
 * Everything a superadmin can do to one school, as ActionsMenu items, plus
 * the dialogs those items open. Render `dialogs` once on the page.
 * `onDeleted` runs after a permanent delete (default: `onChanged`).
 */
export default function useOrganizationActions({ onChanged, onDeleted, showViewDetails = true } = {}) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);
  const [renewing, setRenewing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const manage = (org) => {
    startManagingSchool({ id: org.id, name: org.name });
    navigate("/organization-dashboard/overview");
  };

  const deactivate = async (org) => {
    try {
      await superAdminApi.deactivateOrganization(org.id);
    } catch (err) {
      throw new Error(errorText(err));
    }
    toast(`${org.name} deactivated.`);
    onChanged?.();
  };

  const itemsFor = (org) => [
    { id: "view", label: "View details", icon: Eye, hidden: !showViewDetails, onSelect: () => navigate(`/admin-dashboard/organizations/${org.id}`) },
    { id: "edit", label: "Edit", icon: Pencil, onSelect: () => setEditing(org) },
    { id: "manage", label: "Manage school", icon: LogIn, disabled: !org.is_active, onSelect: () => manage(org) },
    { id: "users", label: "View users", icon: Users, onSelect: () => navigate(`/admin-dashboard/users?organization_id=${org.id}`) },
    { id: "add-user", label: "Add user", icon: UserPlus, onSelect: () => navigate(`/admin-dashboard/users/new-user?organization_id=${org.id}`) },
    {
      id: "subscription",
      label: "Manage subscription",
      icon: CreditCard,
      onSelect: () => setRenewing({ organization_id: org.id, organization_name: org.name, state: org.subscription?.state }),
    },
    org.is_active
      ? {
          id: "deactivate",
          label: "Deactivate",
          icon: PowerOff,
          danger: true,
          separatorBefore: true,
          onSelect: () =>
            setConfirm({
              title: `Deactivate ${org.name}?`,
              message: "Nobody at this school will be able to sign in until you reactivate it. Nothing is deleted.",
              confirmLabel: "Deactivate",
              variant: "danger",
              action: () => deactivate(org),
            }),
        }
      : {
          id: "reactivate",
          label: "Reactivate",
          icon: Power,
          separatorBefore: true,
          onSelect: () =>
            setConfirm({
              title: `Reactivate ${org.name}?`,
              message: "People at this school will be able to sign in again.",
              confirmLabel: "Reactivate",
              action: async () => {
                try {
                  await superAdminApi.activateOrganization(org.id);
                } catch (err) {
                  throw new Error(errorText(err));
                }
                toast(`${org.name} reactivated.`);
                onChanged?.();
              },
            }),
        },
    {
      id: "delete",
      label: "Delete permanently…",
      icon: Trash2,
      danger: true,
      separatorBefore: true,
      onSelect: () => setDeleting(org),
    },
  ];

  const dialogs = (
    <>
      {editing && (
        <OrganizationFormModal
          organizationId={editing.id}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            toast("School updated.");
            onChanged?.();
          }}
        />
      )}
      {renewing && (
        <RenewSubscriptionDialog
          school={renewing}
          onClose={() => setRenewing(null)}
          onDone={(text) => {
            setRenewing(null);
            toast(text);
            onChanged?.();
          }}
        />
      )}
      <DeleteDialog
        open={Boolean(deleting)}
        title={deleting ? `Delete ${deleting.name} permanently?` : ""}
        message="The school and everything in it (classes, subjects, exams, results, attendance, fees…) will be removed."
        confirmText={deleting?.name}
        loadCheck={deleting ? () => superAdminApi.organizationDeleteCheck(deleting.id) : undefined}
        onDelete={() => superAdminApi.deleteOrganization(deleting.id)}
        onDeactivate={deleting?.is_active ? () => deactivate(deleting) : undefined}
        onDeleted={() => {
          toast(`${deleting.name} was deleted.`);
          (onDeleted || onChanged)?.();
        }}
        onClose={() => setDeleting(null)}
      />
      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        variant={confirm?.variant}
        onConfirm={confirm?.action}
        onClose={() => setConfirm(null)}
      />
    </>
  );

  return { itemsFor, dialogs, manage, edit: setEditing, renew: setRenewing };
}
