import { Fragment, useState, type MouseEvent } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface WorkItem {
  slug: string;
  title: string;
  locationUrl?: string;
}

interface CollectionItem {
  slug: string;
  title: string;
  location: string;
  locationUrl: string;
  works: WorkItem[];
}

interface WorksTableProps {
  collections: CollectionItem[];
  base: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function LocationLink({
  label,
  url,
}: {
  label: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function WorksTable({ collections, base }: WorksTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (slug: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const handleRowClick =
    (slug: string, isMultiWork: boolean) => (e: MouseEvent) => {
      if (!isMultiWork) return;
      if ((e.target as HTMLElement).closest("a")) return;
      toggle(slug);
    };

  const totalWorks = collections.reduce((sum, col) => sum + col.works.length, 0);

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">作品名稱</th>
            <th className="px-4 py-3 text-center font-medium">件數</th>
            <th className="px-4 py-3 text-left font-medium">地點</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((col, i) => {
            const isMulti = col.works.length > 1;
            const isOpen = expanded.has(col.slug);
            const hasCollectionUrl = col.locationUrl?.startsWith("http");

            return (
              <Fragment key={col.slug}>
                {/* ── Collection (parent) row ── */}
                <tr
                  className={cn(
                    "border-b transition-colors hover:bg-muted/30",
                    i % 2 === 0 && "bg-muted/10",
                    isMulti && "cursor-pointer select-none",
                  )}
                  onClick={handleRowClick(col.slug, isMulti)}
                >
                  <td className="px-4 py-3 font-medium">
                    <span className="flex items-center gap-2">
                      <span className="inline-flex w-5 shrink-0 items-center justify-center">
                        {isMulti && (
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              isOpen && "rotate-90",
                            )}
                          />
                        )}
                      </span>
                      <a
                        href={`${base}collections/${col.slug}/`}
                        className="hover:text-primary hover:underline underline-offset-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {col.title}
                      </a>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{col.works.length}</td>
                  <td className="px-4 py-3">
                    {hasCollectionUrl ? (
                      <LocationLink
                        label={col.location || "查看地圖"}
                        url={col.locationUrl}
                      />
                    ) : (
                      <span className="text-muted-foreground">
                        {col.location || "-"}
                      </span>
                    )}
                  </td>
                </tr>

                {/* ── Expanded work (child) rows ── */}
                {isMulti &&
                  isOpen &&
                  col.works.map((work, wi) => {
                    // Case 1: same locationUrl → location column empty
                    // Case 2: different locationUrls → show "地點N" with link
                    const showWorkLocation = !hasCollectionUrl && work.locationUrl;

                    return (
                      <tr
                        key={`${col.slug}-${work.slug}`}
                        className="border-b bg-muted/5 last:border-0"
                      >
                        <td className="px-4 py-2">
                          <span className="flex items-center gap-2">
                            <span className="inline-flex w-5 shrink-0" />
                            <a
                              href={`${base}collections/${col.slug}/${work.slug}/`}
                              className="pl-2 text-muted-foreground hover:text-primary hover:underline underline-offset-4"
                            >
                              {work.title || work.slug}
                            </a>
                          </span>
                        </td>
                        <td />
                        <td className="px-4 py-2">
                          {showWorkLocation ? (
                            <LocationLink
                              label={`地點${wi + 1}`}
                              url={work.locationUrl!}
                            />
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
              </Fragment>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t bg-muted/50">
            <td className="px-4 py-3 font-medium">總計</td>
            <td className="px-4 py-3 text-center font-medium">{totalWorks}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}