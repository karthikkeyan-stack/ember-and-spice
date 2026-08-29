"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Upload,
  Flame,
  Leaf,
} from "lucide-react";
import { api, ConfirmButton, Modal, Spinner, Toggle, useToast } from "@/components/admin/ui";
import { formatINR, cn } from "@/lib/utils";

type Item = {
  id: number;
  name: string;
  categoryId: number | null;
  categoryName: string;
  description: string;
  price: number;
  image: string;
  vegetarian: boolean;
  signature: boolean;
  available: boolean;
  sortOrder: number;
};
type Category = { id: number; name: string; enabled: boolean };

const EMPTY = {
  name: "",
  categoryId: "",
  price: "",
  description: "",
  image: "",
  vegetarian: true,
  signature: false,
  available: true,
  sortOrder: 0,
};

export default function AdminMenuPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    try {
      const [menu, cats] = await Promise.all([
        api<{ items: Item[] }>("/api/admin/menu"),
        api<{ categories: Category[] }>("/api/admin/categories"),
      ]);
      setItems(menu.items);
      setCategories(cats.categories);
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (catFilter !== "all" && i.categoryId !== Number(catFilter)) return false;
      if (q && !i.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, query, catFilter]);

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY, categoryId: categories[0] ? String(categories[0].id) : "" });
    setModalOpen(true);
  }

  function openEdit(item: Item) {
    setEditing(item);
    setForm({
      name: item.name,
      categoryId: item.categoryId ? String(item.categoryId) : "",
      price: String(item.price),
      description: item.description,
      image: item.image,
      vegetarian: item.vegetarian,
      signature: item.signature,
      available: item.available,
      sortOrder: item.sortOrder,
    });
    setModalOpen(true);
  }

  async function save() {
    setSaving(true);
    try {
      const payload = { ...form, categoryId: form.categoryId ? Number(form.categoryId) : null };
      if (editing) {
        await api(`/api/admin/menu/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) });
        toast("Menu item updated");
      } else {
        await api("/api/admin/menu", { method: "POST", body: JSON.stringify(payload) });
        toast("Menu item added");
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Save failed", "err");
    } finally {
      setSaving(false);
    }
  }

  async function quickPatch(id: number, patch: Record<string, unknown>, label: string) {
    try {
      await api(`/api/admin/menu/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
      toast(label);
      setItems((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Update failed", "err");
    }
  }

  async function uploadImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Upload failed");
      setForm((f) => ({ ...f, image: json.url }));
      toast("Image uploaded");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed", "err");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Menu</p>
          <h1 className="display-2">Menu items</h1>
          <p className="text-sm text-mute mt-2">
            {items.length} dishes — changes reflect on the public menu instantly.
          </p>
        </div>
        <button type="button" onClick={openAdd} className="btn btn-primary !py-3">
          <Plus className="w-4 h-4" /> Add dish
        </button>
      </header>

      {/* filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes…"
            aria-label="Search dishes"
            className="field !pl-11 !rounded-full"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          aria-label="Filter by category"
          className="field !rounded-full sm:w-56"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* table */}
      <div className="bg-paper border border-line rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-6 py-14 text-sm text-mute text-center">No dishes match. Add one or clear the filters.</p>
        ) : (
          <ul className="divide-y divide-line/70">
            {filtered.map((item) => (
              <li key={item.id} className="px-4 sm:px-6 py-4 flex items-center gap-4">
                <div className="img-frame w-14 h-14 rounded-xl flex-none">
                  {item.image ? (
                    <img src={item.image} alt={item.name} loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-cream-2">
                      <Flame className="w-4 h-4 text-ember/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{item.name}</p>
                    {item.vegetarian ? (
                      <Leaf className="w-3.5 h-3.5 text-leaf" aria-label="Vegetarian" />
                    ) : null}
                    {item.signature ? (
                      <span className="badge-sig !text-[0.55rem]">Signature</span>
                    ) : null}
                  </div>
                  <p className="text-xs text-mute mt-0.5">
                    {item.categoryName} · {formatINR(item.price)}
                  </p>
                </div>
                <div className="hidden md:block">
                  <Toggle
                    checked={item.available}
                    onChange={(v) => quickPatch(item.id, { available: v }, v ? "Now available" : "Marked unavailable")}
                    label={item.available ? "Live" : "Off"}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    aria-label={`Edit ${item.name}`}
                    className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-mute hover:text-ink hover:border-ink transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <ConfirmButton
                    onConfirm={async () => {
                      await api(`/api/admin/menu/${item.id}`, { method: "DELETE" });
                      toast("Dish deleted");
                      load();
                    }}
                    className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-mute transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </ConfirmButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* add / edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit — ${editing.name}` : "Add a dish"}
        wide
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="mi-name">Dish name</label>
            <input
              id="mi-name"
              className="field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Ghee Podi Idli"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="mi-cat">Category</label>
            <select
              id="mi-cat"
              className="field"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="mi-price">Price (₹)</label>
            <input
              id="mi-price"
              className="field"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="160"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="mi-desc">Description</label>
            <textarea
              id="mi-desc"
              className="field resize-none"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="One honest, appetising sentence."
            />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Dish image</label>
            <div className="flex gap-3 items-start">
              <div className="img-frame w-20 h-20 rounded-xl flex-none border border-line">
                {form.image ? (
                  <img src={form.image} alt="Preview" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-cream-2">
                    <Flame className="w-4 h-4 text-ember/40" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  className="field"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="/images/food/dosa.jpg or https://…"
                  aria-label="Image URL"
                />
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="btn btn-outline !py-2.5 !px-4 !text-[0.66rem]"
                >
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {uploading ? "Uploading…" : "Upload image"}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="mi-sort">Sort order</label>
            <input
              id="mi-sort"
              className="field"
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            />
          </div>
          <div className="flex items-end gap-6 pb-1 flex-wrap">
            <Toggle
              checked={form.vegetarian}
              onChange={(v) => setForm({ ...form, vegetarian: v })}
              label="Vegetarian"
            />
            <Toggle
              checked={form.signature}
              onChange={(v) => setForm({ ...form, signature: v })}
              label="Signature"
            />
            <Toggle
              checked={form.available}
              onChange={(v) => setForm({ ...form, available: v })}
              label="Available"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>
            Cancel
          </button>
          <button
            type="button"
            className={cn("btn btn-primary", saving && "opacity-60")}
            onClick={save}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {editing ? "Save changes" : "Add dish"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
