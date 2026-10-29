import { redirect } from "next/navigation";
import { registerProfileAction } from "@/actions/auth";
import ActionForm from "@/components/ActionForm";
import { getSignup } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function RegisterProfilePage() {
  if (!(await getSignup())) redirect("/register");

  return (
    <div className="center-screen">
      <div className="login-container">
        <h2>Create Data Pribadi</h2>
        <ActionForm
          action={registerProfileAction}
          submitLabel="Submit"
          fields={[
            { name: "nama", label: "Name:", maxLength: 100 },
            { name: "dob", label: "Date of Birth:", type: "date" },
            { name: "address", label: "Address:", maxLength: 255 },
            { name: "phone", label: "Phone:", type: "tel", maxLength: 15 },
          ]}
        />
      </div>
    </div>
  );
}
