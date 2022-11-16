import { Link, Outlet, useLocation } from "react-router-dom";

const Tab = ({ isActive, to, children }: any) => {
  return (
    <Link className={`tab tab-lifted ${isActive ? " tab-active" : ""}`} to={to}>
      {children}
    </Link>
  );
};

export default function RequestElement() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("activeTab");
  return (
    <>
      <div className="request-url grid-item">
        <div className="form-control">
          <div className="input-group">
            <select className="select select-bordered">
              <option>GET</option>
              <option>POST</option>
            </select>
            <input type="text" className="input input-bordered w-full" />
            <button className="btn  last:rounded-r-sm">Send</button>
          </div>
        </div>
      </div>
      <div className="request-details grid-item p-2 ">
        <div className="mb-2 ">
          <h2 className="mb-2 font-semibold">General Settings</h2>
          <input
            type="text"
            placeholder="Request Title"
            className="input input-sm input-bordered  w-full "
          />
        </div>
        <h2 className="mb-2 font-semibold">Context Keys</h2>
        <div className="tabs ">
          <Tab to="?activeTab=ctx" isActive={activeTab === "ctx" || !activeTab}>
            CTX
          </Tab>
          <Tab to="?activeTab=cqp" isActive={activeTab === "cqp"}>
            Custom Query Params
          </Tab>
          <Tab to="?activeTab=bt" isActive={activeTab === "bt"}>
            Bearer Token
          </Tab>
          <Tab to="?activeTab=ch" isActive={activeTab === "ch"}>
            Custom Headers
          </Tab>
          <Tab to="?activeTab=body" isActive={activeTab === "body"}>
            Body
          </Tab>
        </div>
        {(activeTab === "ctx" || !activeTab) && (
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
        )}
      </div>
      <Outlet />
    </>
  );
}
