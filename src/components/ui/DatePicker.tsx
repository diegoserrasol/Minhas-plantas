"use client";

import { Input, type InputProps } from "./Input";

export type DatePickerProps = Omit<InputProps, "type">;

export function DatePicker(props: DatePickerProps) {
  return <Input type="date" {...props} />;
}
