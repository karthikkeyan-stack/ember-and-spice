"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, MessageSquareQuote } from "lucide-react";
import { api, ConfirmButton, Modal, Spinner, Toggle, useToast } from "@/components/admin/ui";
import { Stars } from "@/components/bits";
import { cn } from "@/lib/utils";

type Review = {
  id: number;
  customerName: string;
  review: string;
  rating: number;
  date: string;
  approved: boolean;
  sample: boolean;
};

const EMPTY = { customerName: "", review: "", rating: 5, date: "", sample: true, approved: true };

export default function AdminReviewsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Review[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const data = await api<{ reviews: Review[] }>("/api/admin/reviews");
      setRows(data.reviews);
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

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY });
    setModalOpen(true);
  }

  function openEdit(r: Review) {
    setEditing(r);
    setForm({
      customerName: r.customerName,
      review: r.review,
      rating: r.rating,
      date: r.date,
      sample: r.sample,
      approved: r.approved,
    });
    setModalOpen(true);
  }

  async function save() {
    setSaving(true);
    try {
      if (editing) {
        await api(`/api/admin/reviews/${editing.id}`, { method: "PATCH", body: JSON.stringify(form) });
        toast("Review updated");
      } else {
        await api("/api/admin/reviews", { method: "POST", body: JSON.stringify(form) });
        toast("Review added");
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Save failed", "err");
    } finally {
      setSaving(false);
    }
  }

  async function patch(id: number, body: Record<string, unknown>, label: string) {
    try {
      await api(`/api/admin/reviews/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      toast(label);
      setRows((list) => list.map((r) => (r.id === id ? { ...r, ...body } : r)));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Update failed", "err");
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Reviews</p>
          <h1 className="display-2">Guest reviews</h1>
          <p className="text-sm text-mute mt-2">
            Approve what appears on the public page. Demo entries stay labelled as samples.
          </p>
        </div>
        <button type="button" onClick={openAdd} className="btn btn-primary !py-3">
          <Plus className="w-4 h-4" /> Add review
        </button>
      </header>

      {rows.length === 0 ? (
        <div className="bg-paper border border-line rounded-2xl px-6 py-16 text-center text-sm text-mute">
          <MessageSquareQuote className="w-7 h-7 mx-auto mb-3 text-ember/40" />
          No reviews yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((r) => (
            <article
              key={r.id}
              className={cn(
                "bg-paper border rounded-2xl p-6 flex flex-col gap-3 transition-opacity",
                r.approved ? "border-line" : "border-dashed border-line opacity-70"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <Stars rating={r.rating} />
                {r.sample ? (
                  <span className="text-[0.58rem] font-extrabold tracking-[0.16em] uppercase text-mute-light border border-line rounded-full px-2.5 py-1">
                    Sample / demo
                  </span>
                ) : null}
              </div>
              <p className="font-display it leading-relaxed text-ink/85 flex-1">“{r.review}”</p>
              <p className="text-xs text-mute font-bold tracking-[0.14em] uppercase">
                {r.customerName} {r.date ? `· ${r.date}` : ""}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-line/70">
                <Toggle
                  checked={r.approved}
                  onChange={(v) => patch(r.id, { approved: v }, v ? "Review published" : "Review hidden")}
                  label={r.approved ? "Published" : "Hidden"}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(r)}
                    aria-label={`Edit review from ${r.customerName}`}
                    className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-mute hover:text-ink hover:border-ink transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <ConfirmButton
                    onConfirm={async () => {
                      await api(`/api/admin/reviews/${r.id}`, { method: "DELETE" });
                      toast("Review deleted");
                      load();
                    }}
                    className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-mute transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </ConfirmButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit review" : "Add review"}>
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="field-label" htmlFor="rv-name">Customer name</label>
              <input
                id="rv-name"
                className="field"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                placeholder="Priya S."
              />
            </div>
            <div>
              <label className="field-label" htmlFor="rv-date">Date label</label>
              <input
                id="rv-date"
                className="field"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="March 2026"
              />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="rv-rating">Rating</label>
            <select
              id="rv-rating"
              className="field"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="rv-text">Review</label>
            <textarea
              id="rv-text"
              className="field resize-none"
              rows={4}
              value={form.review}
              onChange={(e) => setForm({ ...form, review: e.target.value })}
              placeholder="What did they say?"
            />
          </div>
          <div className="flex gap-8 flex-wrap">
            <Toggle
              checked={form.sample}
              onChange={(v) => setForm({ ...form, sample: v })}
              label="Mark as sample/demo"
            />
            <Toggle
              checked={form.approved}
              onChange={(v) => setForm({ ...form, approved: v })}
              label="Published"
            />
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
              {editing ? "Save changes" : "Add review"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
