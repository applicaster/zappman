import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { NavLink } from "react-router-dom";

export default function MenuItem({
  title,
  to,
  children,
}: {
  title: any;
  to: string;
  children: any;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex justify-between items-center px-4 py-2 text-sm cursor-pointer  hover:bg-slate-200 ${
          isActive ? "bg-black hover:bg-black text-white" : ""
        }`
      }
    >
      <div>{title}</div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild className="group focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className=" w-3 h-3 opacity-0 group-hover:opacity-100 group-active:opacity-100 group-focus:opacity-100 group-focus:outline-none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content align="end" alignOffset={-15} className=" bg-white border py-1 mt-1 w-40 rounded-md  shadow-lg focus:outline-none flex flex-col">
            {children}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </NavLink>
  );
}
