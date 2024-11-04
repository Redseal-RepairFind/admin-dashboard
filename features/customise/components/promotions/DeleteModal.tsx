import Heading from "@/features/shared/table/components/table-heading";

function DeleteModal({
  name,
  closeModal,
  onSubmit,
  type,
  title,
}: {
  name: string;
  closeModal: any;
  onSubmit: any;
  type: string;
  title: string;
}) {
  return (
    <div className="flex flex-col   gap-4 max-w-[480px] mx-auto">
      <div className="flex items-center justify-center">
        <Heading name={title} />
      </div>
      {/* Confirmation for delete */}
      <p className="text-center">
        Are you sure you want to delete {name} {type}?. This action cannot be
        undone.
      </p>

      <div className="grid grid-cols-2 gap-2 items-center gap">
        <button
          className="bg-gray-200 h-12 w-full flex items-center rounded-md justify-center text-gray-800"
          onClick={() => closeModal("delete")}
        >
          Cancel
        </button>
        <button
          className="bg-red-600 h-12 w-full flex items-center rounded-md justify-center text-gray-100"
          onClick={() => onSubmit("delete")}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}

export default DeleteModal;
