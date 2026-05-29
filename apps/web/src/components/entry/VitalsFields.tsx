import type { NewVital } from "@healthpulse/shared";

export type VitalsValue = Omit<NewVital, "date">;

interface Props {
  value: VitalsValue;
  onChange: (v: VitalsValue) => void;
}

export default function VitalsFields({ value, onChange }: Props) {
  const set = (k: keyof VitalsValue, v: string) =>
    onChange({ ...value, [k]: v === "" ? undefined : Number(v) });
  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label="Heart rate (bpm)" value={value.heart_rate} onChange={(v) => set("heart_rate", v)} />
      <Field label="Systolic (mmHg)" value={value.systolic} onChange={(v) => set("systolic", v)} />
      <Field label="Diastolic (mmHg)" value={value.diastolic} onChange={(v) => set("diastolic", v)} />
      <Field label="Temp (°C)" value={value.temp_c} onChange={(v) => set("temp_c", v)} step="0.1" />
      <Field label="Weight (kg)" value={value.weight_kg} onChange={(v) => set("weight_kg", v)} step="0.1" />
    </div>
  );
}

function Field(props: {
  label: string;
  value: number | undefined;
  onChange: (v: string) => void;
  step?: string;
}) {
  return (
    <label className="block text-sm">
      <span>{props.label}</span>
      <input
        type="number"
        step={props.step ?? "1"}
        className="mt-1 w-full rounded border px-2 py-1"
        value={props.value ?? ""}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}
