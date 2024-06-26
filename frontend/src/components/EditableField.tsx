import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { ValueLabel } from "../types/option";

export interface EditingFieldProps {
  options: ValueLabel[];

  field?: string;
  value: string;

  onSave?: (field: string, value: string) => Promise<boolean>;
  onCancel?: (field?: string) => any;
  onDelete?: (field: string) => Promise<boolean>;
  refreshData?: () => any;
}

export default function EditingField({
  options,
  field,
  value,
  onSave,
  onCancel,
  onDelete,
  refreshData,
}: EditingFieldProps) {
  const [editing, setEditing] = useState(!Boolean(value));
  const [tempField, setTempField] = useState(field ? field : options.length == 1 ? options[0].value : field);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
    if (value) setEditing(false);
  }, [value]);

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: "125px 1fr" }}>
      <div className="">
        <Select
          disabled={Boolean(field) || !editing || options.length <= 1}
          options={options}
          value={tempField}
          onChange={(selectVal) => setTempField(selectVal)}
          className="w-full"
        ></Select>
      </div>

      <div className="flex gap-2 items-center">
        <div className="flex-grow">
          <Input
            disabled={!editing}
            value={tempValue}
            onChange={(e) => {
              setTempValue(e.target.value);
            }}
          ></Input>
        </div>

        {editing ? (
          <>
            <Button
              icon={<CheckOutlined />}
              disabled={!tempField || !tempValue}
              onClick={async () => {
                if (tempField && tempValue) {
                  if (onSave && await onSave(tempField, tempValue)) {
                    if (refreshData) refreshData();
                    setEditing(false)
                  }
                }
              }}
              type="primary"
            ></Button>

            <Button
              icon={<CloseOutlined />}
              onClick={async () => {
                if (!field || !value) {
                  if (onCancel) onCancel()
                } else {
                  setTempField(field)
                  setTempValue(value)
                  setEditing(false)
                }
              }}
              danger
            ></Button>
          </>
        ) : (
          <>
            <Button
              icon={<EditOutlined />}
              onClick={() => setEditing(true)}
            ></Button>

            <Button
              icon={<DeleteOutlined />}
              onClick={async () => {
                if (field) {
                  if (!onDelete || (await onDelete(field))) {
                    if (onCancel) onCancel(field);
                    if (refreshData) refreshData();
                  }
                }
              }}
              danger
            ></Button>
          </>
        )}
      </div>
    </div>
  );
}
