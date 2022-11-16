export default function ctxFieldPairs() {
  return (
    <div className="flex gap-4">
      <div className="form-control flex-1 ">
        <label className="label">
          <span className="label-text">Key</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          className="input input-sm input-bordered w-full "
        />
      </div>
      <div className="form-control flex-1 ">
        <label className="label">
          <span className="label-text">Rename</span>
        </label>
        <label className="input-group">
          <span>
            <input type="checkbox" className="checkbox checkbox-xs" />
          </span>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered input-sm w-full"
          />
        </label>
      </div>
    </div>
  );
}
