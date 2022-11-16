import { Link, NavLink, Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div className="app bg-base-100" color="black">
        <header className="grid-item p-2 font-bold">
          <Link to={"/"}>Zappman (Alpha)</Link>
        </header>
        <div id="menu" className="grid-item bg-base-100" color="black">
          <div className="text-right p-2 border-b-2">
            <div className="dropdown ">
              <label tabIndex={0} className="btn btn-xs">
                New
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-slate-500 shadow"
              >
                <li>
                  <a>Feed</a>
                </li>
              </ul>
            </div>
          </div>
          <ul className="menu menu-compact py-1">
            <li>
              <NavLink to={"/requests/1/responses/1"}>
                <div>JW Playlist for all shows</div>
              </NavLink>
            </li>
            {/* <li className="menu-title">
              <span>Login flow</span>
            </li>
            <li>
              <a>Login</a>
            </li>
            <li>
              <a>Refresh</a>
            </li> */}
          </ul>
        </div>
        <Outlet />
      </div>
    </>
  );
}
