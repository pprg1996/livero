import tw from "twin.macro";

const SwitchToggle = ({ checked, setChecked, label }: { checked: boolean; setChecked: Function; label: string }) => {
  return (
    <div className="switch-toggle">
      <div tw="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
        <input
          type="checkbox"
          name="toggle"
          id="toggle"
          tw="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          css={[checked ? tw`right-0 border-green-400` : null]}
          className="toggle-checkbox"
          onChange={e => setChecked(e.currentTarget.checked)}
          checked={checked}
        />
        <label
          htmlFor="toggle"
          tw="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
          css={[checked ? tw`bg-green-400` : null]}
          className="toggle-label"
        ></label>
      </div>

      <label htmlFor="toggle" tw="text-xs text-gray-700">
        {label}
      </label>
    </div>
  );
};

export default SwitchToggle;
