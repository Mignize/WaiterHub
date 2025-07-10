import Modal from '@/components/Modal';

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  loading,
}: DeleteConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p>{description}</p>
        <div className="flex gap-2 justify-end">
          <button className="px-4 py-2 rounded bg-zinc-700 text-zinc-100" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-700 text-white font-bold"
            onClick={onConfirm}
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
