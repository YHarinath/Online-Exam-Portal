import { SettingsForm } from "@/components/auth/SettingsForm";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
          Admin Settings
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Update your administrative profile and security.
        </p>
      </div>

      <SettingsForm />
    </div>
  );
}
