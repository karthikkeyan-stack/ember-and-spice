"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Plus, Pencil, Trash2, Loader2, Upload, ArrowUp, ArrowDown, Images } from "lucide-react";
import { api, ConfirmButton, Modal, Spinner, useToast } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type GalleryImage = {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  sortOrder: number;
};

const GALLERY_CATS = ["Food", "Interior", "People", "Details"];
const EMPTY = { title: "", category: "Food", imageUrl: "" };

export default function AdminGalleryPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    try {
      const data = await api<{ images: GalleryImage[] }>("/api/admin/gallery");
      setImages([...data.images].sort((a, b) => a.sortOrder - b.sortOrder));
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

  const visible = useMemo(
    () => images.filter((g) => filter === "All" || g.category === filter),
    [images, filter]
  );

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY });
    setModalOpen(true);
  }

  function openEdit(img: GalleryImage) {
    setEditing(img);
    setForm({ title: img.title, category: img.category, imageUrl: img.imageUrl });
    setModalOpen(true);
  }

  async function save() {
    setSaving(true);
    try {
      if (editing) {
        await api(`/api/admin/gallery/${editing.id}`, { method: "PATCH", body: JSON.stringify(form) });
        toast("Photo updated");
      } else {
        await api("/api/admin/gallery", {
          method: "POST",
          body: JSON.stringify({ ...form, sortOrder: images.length + 1 }),
        });
        toast("Photo added to gallery");
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Save failed", "err");
    } finally {
      setSaving(false);
    }
  }

  async function move(global: GalleryImage, dir: -1 | 1) {
    const siblings = images.filter((s) => s.category === global.category);
    const idx = siblings.findIndex((s) => s.id === global.id);
    const other = siblings[idx + dir];
    if (!other) {
      toast("Reorder applies within the same category", "err");
      return;
    }
    await Promise.all([
      api(`/api/admin/gallery/${global.id}`, { method: "PATCH", body: JSON.stringify({ sortOrder: other.sortOrder }) }),
      api(`/api/admin/gallery/${other.id}`, { method: "PATCH", body: JSON.stringify({ sortOrder: global.sortOrder }) }),
    ]);
    await load();
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
      setForm((f) => ({ ...f, imageUrl: json.url }));
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
          <p className="eyebrow mb-3">Gallery</p>
          <h1 className="display-2">Gallery photos</h1>
          <p className="text-sm text-mute mt-2">{images.length} photographs across the public gallery.</p>
        </div>
        <button type="button" onClick={openAdd} className="btn btn-primary !py-3">
          <Plus className="w-4 h-4" /> Add photo
        </button>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {["All", ...GALLERY_CATS].map((c) => (
          <button key={c} type="button" className="chip" data-active={filter === c} onClick={() => setFilter(c)}>
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="bg-paper border border-line rounded-2xl px-6 py-16 text-center text-sm text-mute">
          <Images className="w-7 h-7 mx-auto mb-3 text-ember/40" />
          Nothing in this set yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((img) => (
            <figure key={img.id} className="group relative rounded-2xl overflow-hidden border border-line bg-paper">
              <div className="img-frame aspect-[4/3]">
                <img src={img.imageUrl} alt={img.title} loading="lazy" />
              </div>
              <figcaption className="p-4">
                <p className="font-semibold text-sm truncate">{img.title}</p>
                <p className="text-[0.62rem] font-extrabold tracking-[0.18em] uppercase text-mute mt-1">
                  {img.category}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => openEdit(img)}
                    aria-label={`Edit ${img.title}`}
                    className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-mute hover:text-ink hover:border-ink transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(img, -1)}
                    aria-label="Move earlier"
                    className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-mute hover:text-ink hover:border-ink transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(img, 1)}
                    aria-label="Move later"
                    className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-mute hover:text-ink hover:border-ink transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <ConfirmButton
                    onConfirm={async () => {
                      await api(`/api/admin/gallery/${img.id}`, { method: "DELETE" });
                      toast("Photo removed");
                      load();
                    }}
                    className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-mute transition-colors ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </ConfirmButton>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit photo" : "Add photo"}>
        <div className="space-y-5">
          <div>
            <label className="field-label" htmlFor="gi-title">Title</label>
            <input
              id="gi-title"
              className="field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. The dining room, evening"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="gi-cat">Category</label>
            <select
              id="gi-cat"
              className="field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {GALLERY_CATS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Image</label>
            <div className="flex gap-3 items-start">
              <div className="img-frame w-24 h-18 rounded-xl border border-line flex-none aspect-[4/3]">
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="Preview" />
                ) : (
                  <div className="w-full h-full bg-cream-2" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  className="field"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="/images/… or https://…"
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
          <div className="flex justify-end gap-3 pt-2">
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
              {editing ? "Save changes" : "Add photo"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
