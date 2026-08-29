"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Trash2 } from "lucide-react";
import { api, ConfirmButton, Spinner, StatusPill, useToast } from "@/components/admin/ui";
import { formatDate, formatTime12 } from "@/lib/utils";

type Reservation = {
  id: number;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  specialRequest: string;
  status: string;
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export default function AdminReservationsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState("all");

  async function load() {
    try {
      const data = await api<{ reservations: Reservation[] }>("/api/admin/reservations");
      setRows(data.reservations);
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
    () => rows.filter((r) => filter === "all" || r.status === filter),
    [rows, filter]
  );

  const pendingCount = rows.filter((r) => r.status === "pending").length;

  async function setStatus(r: Reservation, status: string) {
    try {
      await api(`/api/admin/reservations/${r.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      toast(`Reservation ${status}`);
      setRows((list) => list.map((x) => (x.id === r.id ? { ...x, status } : x)));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Update failed", "err");
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow mb-3">Bookings</p>
        <h1 className="display-2">Reservations</h1>
        <p className="text-sm text-mute mt-2">
          {pendingCount} pending · new requests from the website land here instantly.
        </p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {["all", ...STATUSES].map((s) => (
          <button key={s} type="button" className="chip" data-active={filter === s} onClick={() => setFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-paper border border-line rounded-2xl overflow-hidden">
        {visible.length === 0 ? (
          <p className="px-6 py-14 text-sm text-mute text-center">
            <CalendarDays className="w-6 h-6 mx-auto mb-3 text-ember/40" />
            No reservations in this state.
          </p>
        ) : (
          <>
            {/* desktop table */}
            <table className="hidden md:table w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[0.62rem] font-extrabold tracking-[0.2em] uppercase text-mute">
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-4 py-4">Date & time</th>
                  <th className="px-4 py-4">Guests</th>
                  <th className="px-4 py-4">Notes</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {visible.map((r) => (
                  <tr key={r.id} className="align-top">
                    <td className="px-6 py-4">
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-xs text-mute">{r.phone}</p>
                      {r.email ? <p className="text-xs text-mute">{r.email}</p> : null}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {formatDate(r.date)}
                      <span className="text-mute"> · {formatTime12(r.time)}</span>
                    </td>
                    <td className="px-4 py-4">{r.guests}</td>
                    <td className="px-4 py-4 max-w-[12rem]">
                      <span className="text-xs text-mute line-clamp-2">{r.specialRequest || "—"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="px-4 py-4 pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={r.status}
                          onChange={(e) => setStatus(r, e.target.value)}
                          aria-label={`Set status for ${r.name}`}
                          className="field !py-2 !px-3 !rounded-lg !text-xs !w-auto"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ConfirmButton
                          onConfirm={async () => {
                            await api(`/api/admin/reservations/${r.id}`, { method: "DELETE" });
                            toast("Reservation removed");
                            load();
                          }}
                          className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-mute transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </ConfirmButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* mobile cards */}
            <ul className="md:hidden divide-y divide-line/70">
              {visible.map((r) => (
                <li key={r.id} className="px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm">{r.name}</p>
                      <p className="text-xs text-mute">{r.phone}</p>
                    </div>
                    <StatusPill status={r.status} />
                  </div>
                  <p className="text-xs text-mute">
                    {formatDate(r.date)} · {formatTime12(r.time)} · {r.guests} guests
                    {r.specialRequest ? ` · “${r.specialRequest}”` : ""}
                  </p>
                  <div className="flex items-center gap-2">
                    <select
                      value={r.status}
                      onChange={(e) => setStatus(r, e.target.value)}
                      aria-label={`Set status for ${r.name}`}
                      className="field !py-2 !px-3 !rounded-lg !text-xs flex-1"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ConfirmButton
                      onConfirm={async () => {
                        await api(`/api/admin/reservations/${r.id}`, { method: "DELETE" });
                        toast("Reservation removed");
                        load();
                      }}
                      className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-mute transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </ConfirmButton>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
