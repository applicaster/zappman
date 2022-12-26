function disabledByKey(key?:string) {
  if (!key) return false;
  return ['Content-Type'].includes(key)
}

export default function FieldPairs({
  index,
  defaultKeyValue,
  defaultValueValue,
  prefix
}: {
  index: number;
  defaultKeyValue?: string;
  defaultValueValue?: string;
  prefix: string
}) {
  return (
    <div className="flex gap-4">
      <div className="form-control flex-1">
        <label className="label">
          <span className="label-text">Key</span>
        </label>
        <input
          disabled={disabledByKey(defaultKeyValue)}
          name={`${prefix}.${index}.key`}
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
            name={`${prefix}.${index}.value`}
            disabled={disabledByKey(defaultKeyValue)}
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
