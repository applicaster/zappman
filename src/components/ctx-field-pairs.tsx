export default function ctxFieldPairs({
  index,
  defaultKeyValue,
  defaultValueValue,
}: {
  index: number;
  defaultKeyValue?: string;
  defaultValueValue?: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="form-control flex-1">
        <label className="label">
          <span className="label-text">Key</span>
        </label>
        <input
          name={`ctx.${index}.key`}
          defaultValue={defaultKeyValue}
          type="text"
          placeholder="Type here"
          className="input input-sm input-bordered w-full "
        />
      </div>
      <div className="form-control flex-1 ">
        <label className="label">
          <span className="label-text">Value</span>
        </label>
        <label className="input-group">
          <input
            name={`ctx.${index}.value`}
            defaultValue={defaultValueValue}
            type="text"
            placeholder="Type here"
            className="input input-bordered input-sm w-full"
          />
        </label>
      </div>
    </div>
  );
}
