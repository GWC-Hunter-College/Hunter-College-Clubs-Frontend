import { Modal } from "@mantine/core";
import Button from "./Button";

type ConfirmModalProps = {
  opened: boolean;
  onClose: () => void;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  confirming?: boolean;
};

/** Reused for "Leave club?" and other destructive confirmations, styled like the Gate card. */
export default function ConfirmModal({ opened, onClose, title, body, confirmLabel, onConfirm, confirming }: ConfirmModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} withCloseButton={false} centered size={440} radius="xl">
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 8 }}>
        <h2 className="text-heading-l" style={{ margin: 0, color: "var(--text-primary)" }}>
          {title}
        </h2>
        <p className="text-body-m" style={{ margin: 0, color: "var(--text-secondary)" }}>
          {body}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button variant="ghost" size="m" onClick={onClose}>
            CANCEL
          </Button>
          <Button variant="danger" size="m" onClick={onConfirm} disabled={confirming}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
