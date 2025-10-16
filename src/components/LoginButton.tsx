import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p>Signed in as {session.user?.email}</p>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }

  return (
    <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>
  );
}