"use client";

import { Ghost } from "ghostlyjs";
import Link from "next/link";

import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import CopyButton from "./copy-button";
import { AvatarBadge, Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { HoverCardTrigger, HoverCardContent, HoverCard } from "./ui/hover-card";

export default function NavbarAvatar({ connected }: { connected: boolean }) {
  const { data: session, isPending: isSessionPending } = useSession();
  const user = session?.user;
  const fallbackChar = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <Ghost name="navbar-avatar" isLoading={isSessionPending}>
      <HoverCard openDelay={10} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Link href="/account-settings">
            <Avatar>
              <AvatarImage
                id="profile-picture"
                src={user?.image || undefined}
                alt="Profilbild"
              />
              <AvatarFallback>{fallbackChar}</AvatarFallback>
              <AvatarBadge
                className={connected ? "bg-positive" : "bg-destructive"}
              />
            </Avatar>
          </Link>
        </HoverCardTrigger>
        <HoverCardContent className="flex w-72 flex-col gap-2.5 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-medium">{user?.name}</span>
            <span
              className={cn(
                "flex shrink-0 items-center gap-1.5 text-xs",
                connected ? "text-positive" : "text-destructive",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  connected ? "bg-positive" : "bg-destructive",
                )}
              />
              {connected ? "Online" : "Offline"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-md bg-muted px-2.5 py-1.5">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                Spieler-ID
              </span>
              <span className="truncate font-mono text-xs">{user?.id}</span>
            </div>
            <CopyButton textToCopy={user?.id} />
          </div>
        </HoverCardContent>
      </HoverCard>
    </Ghost>
  );
}
