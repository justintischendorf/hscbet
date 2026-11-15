import { useSession } from "@/lib/auth-client";

export function useIsAdmin() {
  const session = useSession();
  return session.data?.user.role === "admin";
}
