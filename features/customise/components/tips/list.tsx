type ListProps = {
  state: string;
  onClick: (value: string) => void;
  closeModal: () => void;
  filterProps: any[]; // Array of filter options to display in the list (default is ['All', 'Customer', 'Contractor'])
};

export function List({ state, onClick, closeModal, filterProps }: ListProps) {
  function handleSelect(text: string) {
    onClick(text);
    closeModal(); // Close the modal when a filter is selected
  }
  return (
    <ul className="absolute text-xs font-medium border border-gray-400 rounded-sm  focus:ring-0  outline-none w-28 left-0 top-14 bg-white shadow-2xl transition-all duration-500 z-30">
      {filterProps.map((filterProp) => (
        <li
          className={`${
            state.toLowerCase().includes(filterProp.toLowerCase())
              ? "bg-black text-white"
              : "bg-white text-black"
          } w-full mb-2 p-2 hover:bg-black hover:text-white cursor-pointer transition-all duration-300 text-start`}
          key={filterProp}
          onClick={() => handleSelect(filterProp)}
        >
          {filterProp}
        </li>
      ))}
    </ul>
  );
}
