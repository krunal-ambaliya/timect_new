"use client";

import { useState } from "react";
import { GripVertical, Plus, Trash2, ImagePlus } from "lucide-react";
import type { Variant } from "@/db/actions";
import MediaPicker from "@/admin/components/media/MediaPicker";

export default function VariantEditor({
  variants,
  onChange,
}: {
  variants: Variant[];
  onChange: (v: Variant[]) => void;
}) {
  const [pickerFor, setPickerFor] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const update = (idx: number, patch: Partial<Variant>) => {
    const next = variants.map((v, i) => (i === idx ? { ...v, ...patch } : v));
    onChange(next);
  };

  const add = () => {
    onChange([
      ...variants,
      {
        id: `v${Date.now()}`,
        name: "",
        image: "",
      },
    ]);
  };

  const remove = (idx: number) => {
    onChange(variants.filter((_, i) => i !== idx));
  };

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    const next = [...variants];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--admin-muted)]">
          Unlimited color / finish variants with optional images
        </p>
        <button type="button" className="admin-btn admin-btn-primary" onClick={add}>
          <Plus className="h-4 w-4" />
          Add variant
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--admin-line)] py-12 text-center text-sm text-[var(--admin-muted)]">
          No variants yet. Add Blue, Green, Gold, etc.
        </div>
      ) : (
        <div className="space-y-3">
          {variants.map((v, idx) => (
            <div
              key={v.id}
              draggable
              onDragStart={() => setDragIndex(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex != null) reorder(dragIndex, idx);
                setDragIndex(null);
              }}
              className="admin-card flex flex-wrap items-center gap-3 p-3"
            >
              <span className="admin-drag-handle">
                <GripVertical className="h-4 w-4" />
              </span>
              <button
                type="button"
                className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[var(--admin-line)] bg-[var(--admin-bg)]"
                onClick={() => setPickerFor(idx)}
                title="Variant image"
              >
                {v.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={v.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus className="mx-auto h-5 w-5 text-[var(--admin-muted)]" />
                )}
              </button>
              <div className="min-w-[160px] flex-1">
                <label className="admin-label">Variant name</label>
                <input
                  className="admin-input"
                  value={v.name}
                  onChange={(e) => update(idx, { name: e.target.value })}
                  placeholder="e.g. Blue"
                />
              </div>
              <div className="min-w-[200px] flex-[2]">
                <label className="admin-label">Image URL</label>
                <input
                  className="admin-input"
                  value={v.image}
                  onChange={(e) => update(idx, { image: e.target.value })}
                  placeholder="https://…"
                />
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-danger px-2"
                onClick={() => remove(idx)}
                aria-label="Delete variant"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <MediaPicker
        open={pickerFor != null}
        onClose={() => setPickerFor(null)}
        onSelect={(url) => {
          if (pickerFor != null) update(pickerFor, { image: url });
          setPickerFor(null);
        }}
      />
    </div>
  );
}
