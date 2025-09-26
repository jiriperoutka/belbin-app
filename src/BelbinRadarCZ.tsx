import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";

// ——————————————————————————————————————————————
// Belbin (CZ) – Bez Tailwindu / shadcn
// Zkratky: IN, FO, VŠ, KO, ST, RE, DO, AN
// ——————————————————————————————————————————————
const ROLE_ORDER = ["IN", "FO", "VŠ", "KO", "ST", "RE", "DO", "AN"] as const;

type RoleKey = (typeof ROLE_ORDER)[number];

type RoleMeta = { key: RoleKey; name: string; desc: string };

const ROLES: Record<RoleKey, RoleMeta> = {
  IN: { key: "IN", name: "Inovátor", desc: "Přináší nové nápady (Plant)." },
  FO: { key: "FO", name: "Formovač", desc: "Tlačí na výkon (Shaper)." },
  VŠ: {
    key: "VŠ",
    name: "Vyhledávač zdrojů",
    desc: "Navazuje kontakty (Resource Investigator).",
  },
  KO: {
    key: "KO",
    name: "Koordinátor",
    desc: "Rozděluje práci (Coordinator).",
  },
  ST: { key: "ST", name: "Stmelovač", desc: "Buduje spolupráci (Teamworker)." },
  RE: {
    key: "RE",
    name: "Realizátor",
    desc: "Uvádí plány do praxe (Implementer).",
  },
  DO: {
    key: "DO",
    name: "Dotahovač",
    desc: "Dbá na dokončení (Completer Finisher).",
  },
  AN: {
    key: "AN",
    name: "Analytik",
    desc: "Kriticky hodnotí (Monitor Evaluator).",
  },
};

const PAL = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#9333ea", // původní 4 barvy
  "#dc2626",
  "#0891b2",
  "#ca8a04",
  "#be185d", // další 4 barvy
  "#7c3aed",
  "#059669",
  "#c2410c",
  "#4338ca", // další 4 barvy
  "#b91c1c",
  "#0f766e",
  "#a16207",
  "#9d174d", // další 4 barvy
]; // barvy pro více kandidátů

interface Candidate {
  id: string;
  name: string;
  color: string;
  scores: Record<RoleKey, number>;
}

const makeEmptyScores = (): Record<RoleKey, number> =>
  ROLE_ORDER.reduce(
    (acc, k) => ({ ...acc, [k]: 0 }),
    {} as Record<RoleKey, number>
  );

const DEFAULT_CANDIDATE = (idx: number): Candidate => ({
  id: crypto.randomUUID(),
  name: `Kandidát ${idx + 1}`,
  color: PAL[idx % PAL.length],
  scores: makeEmptyScores(),
});

function toRadarData(cands: Candidate[]) {
  return ROLE_ORDER.map((role) => {
    const row: any = { role, label: `${role} – ${ROLES[role].name}` };
    cands.forEach((c) => (row[c.name] = c.scores[role]));
    return row;
  });
}

function computeMax(cands: Candidate[]) {
  const maxVal = Math.max(10, ...cands.flatMap((c) => Object.values(c.scores)));
  return Math.ceil(maxVal / 5) * 5;
}

const DEMO: Candidate[] = [
  {
    id: crypto.randomUUID(),
    name: "Jana",
    color: PAL[0],
    scores: { IN: 9, FO: 6, VŠ: 8, KO: 5, ST: 7, RE: 4, DO: 6, AN: 5 },
  },
  {
    id: crypto.randomUUID(),
    name: "Petr",
    color: PAL[1],
    scores: { IN: 5, FO: 8, VŠ: 6, KO: 7, ST: 6, RE: 7, DO: 8, AN: 6 },
  },
  {
    id: crypto.randomUUID(),
    name: "Lucie",
    color: PAL[2],
    scores: { IN: 7, FO: 5, VŠ: 7, KO: 6, ST: 8, RE: 5, DO: 7, AN: 7 },
  },
];

const S: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 980,
    margin: "0 auto",
    padding: 20,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
    marginBottom: 10,
  },
  h1: { fontSize: 24, margin: 0 },
  sub: { opacity: 0.7, fontSize: 14 },
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 12,
    alignItems: "start",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  label: {
    display: "block",
    fontSize: 12,
    marginBottom: 6,
    color: "#374151",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: 8,
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#000000",
    fontSize: "14px",
  },
  btn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    background: "#fff",
    color: "#000000",
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #1d4ed8",
    background: "#1d4ed8",
    color: "#fff",
    cursor: "pointer",
  },
  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  tabs: { display: "flex", gap: 8, marginTop: 8 },
  tab: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    background: "#fff",
    color: "#000000",
    cursor: "pointer",
  },
  tabActive: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #1d4ed8",
    background: "#eff6ff",
    color: "#1d4ed8",
    cursor: "pointer",
  },
};

export default function BelbinRadarCZ() {
  const [candidates, setCandidates] = useState<Candidate[]>([
    DEFAULT_CANDIDATE(0),
  ]);
  const [tab, setTab] = useState<"edit" | "viz" | "legend">("edit");

  const radarData = useMemo(() => toRadarData(candidates), [candidates]);
  const maxDomain = useMemo(() => computeMax(candidates), [candidates]);

  const maxCandidates = 16; // configurable maximum
  const addCandidate = () =>
    candidates.length < maxCandidates &&
    setCandidates((p) => [...p, DEFAULT_CANDIDATE(p.length)]);
  const removeCandidate = (id: string) =>
    setCandidates((p) => p.filter((c) => c.id !== id));
  const updateName = (id: string, name: string) =>
    setCandidates((p) =>
      p.map((c) => (c.id === id ? { ...c, name: name || "Bez jména" } : c))
    );
  const updateScore = (id: string, role: RoleKey, val: number) =>
    setCandidates((p) =>
      p.map((c) =>
        c.id === id
          ? {
              ...c,
              scores: {
                ...c.scores,
                [role]: Math.max(0, Math.min(20, Math.round(val || 0))),
              },
            }
          : c
      )
    );
  const loadDemo = () => {
    setCandidates(DEMO.map((d) => ({ ...d, id: crypto.randomUUID() })));
    setTab("viz");
  };
  const resetAll = () => setCandidates([DEFAULT_CANDIDATE(0)]);

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.h1}>Belbin – Týmové role (CZ)</h1>
          <div style={S.sub}>
            Zadejte výsledky pro kandidáty a porovnejte je v radar grafu.
            Zkratky: {ROLE_ORDER.join(", ")}. Doporučený rozsah 0–10 (max 20).
          </div>
          <div style={S.tabs}>
            <button
              style={tab === "edit" ? S.tabActive : S.tab}
              onClick={() => setTab("edit")}
            >
              Vstup dat
            </button>
            <button
              style={tab === "viz" ? S.tabActive : S.tab}
              onClick={() => setTab("viz")}
            >
              Vizualizace
            </button>
            <button
              style={tab === "legend" ? S.tabActive : S.tab}
              onClick={() => setTab("legend")}
            >
              Legenda
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={S.btn} onClick={loadDemo} title="Načíst ukázková data">
            Ukázka
          </button>
          <button
            style={S.btn}
            onClick={resetAll}
            title="Vymazat a začít znovu"
          >
            Reset
          </button>
        </div>
      </div>

      {tab === "edit" && (
        <div style={S.row}>
          {candidates.map((c, idx) => (
            <div key={c.id} style={S.card}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      background: c.color,
                    }}
                  />
                  <input
                    style={{ ...S.input, maxWidth: 240 }}
                    value={c.name}
                    onChange={(e) => updateName(c.id, e.target.value)}
                    placeholder={`Kandidát ${idx + 1}`}
                  />
                  <span style={{ fontSize: 12, opacity: 0.6 }}>#{idx + 1}</span>
                </div>
                <button
                  style={S.btn}
                  onClick={() => removeCandidate(c.id)}
                  disabled={candidates.length === 1}
                >
                  Odebrat
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 12,
                }}
              >
                {ROLE_ORDER.map((rk) => (
                  <div key={rk}>
                    <label style={S.label}>
                      {rk} – {ROLES[rk].name}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      step={1}
                      value={c.scores[rk]}
                      onChange={(e) =>
                        updateScore(c.id, rk, Number(e.target.value))
                      }
                      style={S.input}
                    />
                  </div>
                ))}
              </div>

              <div style={S.footerRow}>
                <small style={S.sub}>
                  Rozsah vstupu je 0–20. Do grafu se nezahrnuje „Specialista“
                  ani „Neutrální body“.
                </small>
              </div>
            </div>
          ))}

          <div
            style={{
              ...S.card,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              Kandidáti ({candidates.length}/{maxCandidates})
            </div>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>
              Každý kandidát má svou barvu v grafu.
            </div>
            <button
              style={S.btnPrimary}
              onClick={addCandidate}
              disabled={candidates.length >= maxCandidates}
            >
              Přidat kandidáta
            </button>
          </div>
        </div>
      )}

      {tab === "viz" && (
        <div style={S.card}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            Radar graf porovnání
          </div>
          <div style={{ height: 460 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius={150}>
                <PolarGrid />
                <PolarAngleAxis dataKey="label" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis
                  domain={[0, maxDomain]}
                  tickCount={Math.min(6, Math.ceil(maxDomain / 5) + 1)}
                  angle={90}
                />
                {candidates.map((c) => (
                  <Radar
                    key={c.id}
                    name={c.name}
                    dataKey={c.name}
                    stroke={c.color}
                    fill={c.color}
                    fillOpacity={0.18}
                  />
                ))}
                <Legend />
                <Tooltip formatter={(v: any) => `${v}`} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "legend" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 12,
            alignItems: "start",
          }}
        >
          {ROLE_ORDER.map((rk) => (
            <div key={rk} style={S.card}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <span style={{ fontWeight: 600 }}>{rk}</span>
                <span>– {ROLES[rk].name}</span>
              </div>
              <div style={S.sub}>{ROLES[rk].desc}</div>
            </div>
          ))}
          <div
            style={{ ...S.card, background: "#f8fafc", gridColumn: "1 / -1" }}
          >
            <div style={{ fontSize: 13 }}>
              Pozn.: Názvy odpovídají běžným českým překladům Belbinových rolí:
              Inovátor (Plant), Formovač (Shaper), Vyhledávač zdrojů (Resource
              Investigator), Koordinátor (Coordinator), Stmelovač (Teamworker),
              Realizátor (Implementer), Dotahovač (Completer Finisher), Analytik
              (Monitor Evaluator).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
