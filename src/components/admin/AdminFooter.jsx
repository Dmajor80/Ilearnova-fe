/** Footer for the superadmin area. */
export default function AdminFooter({ className = "" }) {
  return (
    <footer className={`border-t border-gray-200 pt-5 text-sm text-gray-500 ${className}`}>
      <p>© {new Date().getFullYear()} iLearnova · Platform admin</p>
    </footer>
  );
}
