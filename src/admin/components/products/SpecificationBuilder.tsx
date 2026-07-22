"use client";

import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import type { Specification } from "@/db/actions";
import { SPEC_SECTION_TYPES } from "@/admin/lib/constants";

/**
 * Dynamic specification builder.
 * Output JSON matches storefront structure:
 * - type "details": string[] like "Material: Stainless steel"
 * - type "grid": { label, value }[]
 * - type "text": content string
 */
export default function SpecificationBuilder({
  value,
  onChange,
}: {
  value: Specification[];
  onChange: (specs: Specification[]) => void;
}) {
  const updateSection = (idx: number, patch: Partial<Specification>) => {
    const next = value.map((s, i) => {
      if (i !== idx) return s;
      const merged = { ...s, ...patch };
      // Reset items/content when type changes
      if (patch.type && patch.type !== s.type) {
        if (patch.type === "text") {
          return {
            title: merged.title,
            type: "text",
            content: "",
          };
        }
        if (patch.type === "grid") {
          return {
            title: merged.title,
            type: "grid",
            items: [{ label: "", value: "" }],
          };
        }
        return {
          title: merged.title,
          type: "details",
          items: [""],
        };
      }
      return merged;
    });
    onChange(next);
  };

  const addSection = (type: string = "details") => {
    if (type === "text") {
      onChange([...value, { title: "New section", type: "text", content: "" }]);
    } else if (type === "grid") {
      onChange([
        ...value,
        {
          title: "New section",
          type: "grid",
          items: [{ label: "", value: "" }],
        },
      ]);
    } else {
      onChange([
        ...value,
        { title: "New section", type: "details", items: [""] },
      ]);
    }
  };

  const removeSection = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    const to = idx + dir;
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(idx, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-[var(--admin-muted)]">
          Sections map 1:1 to the product accordion. No extra DB columns.
        </p>
        <div className="flex flex-wrap gap-2">
          {SPEC_SECTION_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              className="admin-btn admin-btn-secondary text-xs"
              onClick={() => addSection(t.value)}
            >
              <Plus className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {value.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--admin-line)] py-12 text-center text-sm text-[var(--admin-muted)]">
          No specification sections. Add Case, Dial & Hands, Movement, etc.
        </div>
      ) : (
        <div className="space-y-4">
          {value.map((section, idx) => (
            <div key={idx} className="admin-card overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 border-b border-[var(--admin-line)] bg-[var(--admin-bg)] px-4 py-3">
                <GripVertical className="h-4 w-4 text-[var(--admin-muted)]" />
                <input
                  className="admin-input max-w-xs font-medium"
                  value={section.title}
                  onChange={(e) =>
                    updateSection(idx, { title: e.target.value })
                  }
                  placeholder="Section title"
                />
                <select
                  className="admin-input max-w-[180px]"
                  value={section.type}
                  onChange={(e) =>
                    updateSection(idx, { type: e.target.value })
                  }
                >
                  {SPEC_SECTION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <div className="ml-auto flex gap-1">
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost px-2"
                    onClick={() => moveSection(idx, -1)}
                    disabled={idx === 0}
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost px-2"
                    onClick={() => moveSection(idx, 1)}
                    disabled={idx === value.length - 1}
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger px-2"
                    onClick={() => removeSection(idx)}
                    aria-label="Delete section"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 p-4">
                {section.type === "text" && (
                  <textarea
                    className="admin-input min-h-[100px]"
                    value={section.content || ""}
                    onChange={(e) =>
                      updateSection(idx, { content: e.target.value })
                    }
                    placeholder="Paragraph content…"
                  />
                )}

                {section.type === "details" && (
                  <DetailsItems
                    items={(section.items as string[]) || []}
                    onChange={(items) => updateSection(idx, { items })}
                  />
                )}

                {section.type === "grid" && (
                  <GridItems
                    items={
                      (section.items as { label?: string; value?: string }[]) ||
                      []
                    }
                    onChange={(items) => updateSection(idx, { items })}
                  />
                )}
              </div>

              {/* Live mini preview */}
              <div className="border-t border-[var(--admin-line)] bg-[var(--admin-bg)] px-4 py-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--admin-muted)]">
                  Live preview
                </p>
                <SpecPreview section={section} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailsItems({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="admin-input"
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder="Label: Value  (e.g. Material: Stainless steel)"
          />
          <button
            type="button"
            className="admin-btn admin-btn-ghost px-2"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="admin-btn admin-btn-secondary text-xs"
        onClick={() => onChange([...items, ""])}
      >
        <Plus className="h-3.5 w-3.5" />
        Add line
      </button>
    </div>
  );
}

function GridItems({
  items,
  onChange,
}: {
  items: { label?: string; value?: string }[];
  onChange: (items: { label?: string; value?: string }[]) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            className="admin-input"
            value={item.label || ""}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], label: e.target.value };
              onChange(next);
            }}
            placeholder="Label"
          />
          <input
            className="admin-input"
            value={item.value || ""}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], value: e.target.value };
              onChange(next);
            }}
            placeholder="Value"
          />
          <button
            type="button"
            className="admin-btn admin-btn-ghost px-2"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="admin-btn admin-btn-secondary text-xs"
        onClick={() => onChange([...items, { label: "", value: "" }])}
      >
        <Plus className="h-3.5 w-3.5" />
        Add row
      </button>
    </div>
  );
}

function SpecPreview({ section }: { section: Specification }) {
  if (section.type === "text") {
    return (
      <p className="text-sm text-[var(--admin-ink)]">
        {section.content || "—"}
      </p>
    );
  }
  if (section.type === "grid" && section.items) {
    return (
      <div className="grid grid-cols-2 gap-2 text-sm">
        {section.items.map((item: { label?: string; value?: string }, i: number) => (
          <div key={i}>
            <span className="text-[var(--admin-muted)]">
              {item.label || "—"}:{" "}
            </span>
            <span>{item.value || "—"}</span>
          </div>
        ))}
      </div>
    );
  }
  if (section.type === "details" && section.items) {
    return (
      <ul className="list-inside list-disc space-y-1 text-sm">
        {(section.items as string[]).map((line, i) => (
          <li key={i}>{line || "—"}</li>
        ))}
      </ul>
    );
  }
  return null;
}
