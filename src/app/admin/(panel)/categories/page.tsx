"use client";

import { useEffect, useState } from "react";
import { Plus, ArrowUp, ArrowDown, Check, Trash2, ListTree } from "lucide-react";
import { api, ConfirmButton, Spinner, Toggle, useToast } from "@/components/admin/ui";

type Category = {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  enabled: boolean;
};

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [newName, setNewName] = useState("");
  const [rename, setRename] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const [cats, menu] = await Promise.all([
        api<{ categories: Category[] }>("/api/admin/categories"),
        api<{ items: { id: number; categoryId: number | null }[] }>("/api/admin/menu"),
      ]);
      const sorted = [...cats.categories].sort((a, b) => a.sortOrder - b.sortOrder);
      setCategories(sorted);
      setRename(Object.fromEntries(sorted.map((c) => [c.id, c.name])));
      const tally: Record<number, number> = {};
      for (const item of menu.items) {
        if (item.categoryId) tally[item.categoryId] = (tally[item.categoryId] ?? 0) + 1;
      }
      setCounts(tally);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Load failed", "err");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add() {
    if (newName.trim().length < 2) {
      toast("Give the category a name first", "err");
      return;
    }
    setBusy(true);
    try {
      await api("/api/admin/categories", { method: "POST", body: JSON.stringify({ name: newName.trim() }) });
      toast("Category created");
      setNewName("");
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Create failed", "err");
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: number, body: Record<string, unknown>, label: string) {
    try {
      await api(`/api/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      toast(label);
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Update failed", "err");
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const a = categories[index];
    const b = categories[index + dir];
    if (!a || !b) return;
    await Promise.all([
      api(`/api/admin/categories/${a.id}`, { method: "PATCH", body: JSON.stringify({ sortOrder: b.sortOrder }) }),
      api(`/api/admin/categories/${b.id}`, { method: "PATCH", body: JSON.stringify({ sortOrder: a.sortOrder }) }),
    ]);
    await load();
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow mb-3">Menu</p>
        <h1 className="display-2">Categories</h1>
        <p className="text-sm text-mute mt-2">
          Reorder, rename, or switch categories off. Disabled categories disappear from the public menu.
        </p>
      </header>

      <div className="flex gap-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="New category — e.g. Tiffin Specials"
          aria-label="New category name"
          className="field !rounded-full flex-1"
        />
        <button type="button" onClick={add} disabled={busy} className="btn btn-primary !py-3 flex-none">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="bg-paper border border-line rounded-2xl overflow-hidden">
        {categories.length === 0 ? (
          <p className="px-6 py-14 text-sm text-mute text-center">
            <ListTree className="w-6 h-6 mx-auto mb-3 text-ember/40" />
            No categories yet.
          </p>
        ) : (
          <ul className="divide-y divide-line/70">
            {categories.map((c, i) => (
              <li key={c.id} className="px-4 sm:px-6 py-4 flex items-center gap-3 flex-wrap">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`Move ${c.name} up`}
                    className="w-7 h-7 rounded-full border border-line flex items-center justify-center text-mute hover:text-ink disabled:opacity-25 transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === categories.length - 1}
                    aria-label={`Move ${c.name} down`}
                    className="w-7 h-7 rounded-full border border-line flex items-center justify-center text-mute hover:text-ink disabled:opacity-25 transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  value={rename[c.id] ?? c.name}
                  onChange={(e) => setRename({ ...rename, [c.id]: e.target.value })}
                  aria-label={`Rename ${c.name}`}
                  className="field !rounded-xl flex-1 min-w-[10rem] !py-2.5"
                />
                <span className="text-xs font-bold tracking-[0.14em] uppercase text-mute whitespace-nowrap">
                  {counts[c.id] ?? 0} items
                </span>
                {rename[c.id] !== c.name ? (
                  <button
                    type="button"
                    onClick={() => patch(c.id, { name: rename[c.id] }, "Category renamed")}
                    aria-label="Save name"
                    className="w-9 h-9 rounded-full bg-leaf/10 border border-leaf/40 text-leaf flex items-center justify-center hover:bg-leaf hover:text-cream transition-all"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                ) : null}
                <Toggle
                  checked={c.enabled}
                  onChange={(v) => patch(c.id, { enabled: v }, v ? "Category visible" : "Category hidden")}
                  label={c.enabled ? "On" : "Off"}
                />
                <ConfirmButton
                  onConfirm={async () => {
                    await api(`/api/admin/categories/${c.id}`, { method: "DELETE" });
                    toast("Category deleted — its dishes are uncategorised");
                    load();
                  }}
                  className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-mute transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </ConfirmButton>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
