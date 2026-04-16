import { createFileRoute, Link, useNavigate, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { fetchArticles, type Article } from "@/lib/articles";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — CryptoUptrend" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { session, isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) {
      navigate({ to: "/auth" });
    }
  }, [session, isAdmin, loading, navigate]);

  if (loading || !session || !isAdmin) {
    return (
      <div className="mx-auto max-w-3xl p-12 text-center text-muted-foreground">
        Checking access…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin" className="text-sm font-medium hover:text-brand" activeProps={{ className: "text-brand" }} activeOptions={{ exact: true }}>Articles</Link>
          <Link to="/admin/new" className="inline-flex items-center gap-1.5 rounded-md bg-gradient-brand px-3 py-1.5 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> New
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
