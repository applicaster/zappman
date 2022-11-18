import { Popover } from "@headlessui/react";

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
      reloadDocument
      className={({ isActive }) =>
        `group flex justify-between px-4 py-2 text-sm cursor-pointer  hover:bg-slate-200 ${
          isActive ? "bg-gray-400 hover:bg-gray-400 " : ""
        }`
      }
    >
      <div>{title}</div>
      <Popover as="div" className="relative inline-block text-left">
        <Popover.Button className="group focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-3 h-3 opacity-0 group-hover:opacity-100 group-active:opacity-100 group-focus:opacity-100 group-focus:outline-none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </Popover.Button>
        <Popover.Panel className="absolute bg-white border right-0 py-1 mt-1 w-40 rounded-md  shadow-lg focus:outline-none flex flex-col z-10">
          {children}
        </Popover.Panel>
      </Popover>
    </NavLink>
  );
}
