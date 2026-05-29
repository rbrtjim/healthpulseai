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
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        label="Heart rate"
        unit="bpm"
        value={value.heart_rate}
        onChange={(v) => set("heart_rate", v)}
      />
      <Field
        label="Systolic"
        unit="mmHg"
        value={value.systolic}
        onChange={(v) => set("systolic", v)}
      />
      <Field
        label="Diastolic"
        unit="mmHg"
        value={value.diastolic}
        onChange={(v) => set("diastolic", v)}
      />
      <Field
        label="Temperature"
        unit="°C"
        step="0.1"
        value={value.temp_c}
        onChange={(v) => set("temp_c", v)}
      />
      <Field
        label="Weight"
        unit="kg"
        step="0.1"
        value={value.weight_kg}
        onChange={(v) => set("weight_kg", v)}
      />
    </div>
  );
}

function Field(props: {
  label: string;
  unit: string;
  value: number | undefined;
  onChange: (v: string) => void;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
        {props.label}
      </span>
      <div className="mt-2 flex items-center rounded-md border border-border bg-bg focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
        <input
          type="number"
          step={props.step ?? "1"}
          className="w-full bg-transparent px-3 py-2 text-text focus:outline-none"
          value={props.value ?? ""}
          onChange={(e) => props.onChange(e.target.value)}
        />
        <span className="pr-3 text-xs uppercase tracking-wider text-muted">
          {props.unit}
        </span>
      </div>
    </label>
  );
}
