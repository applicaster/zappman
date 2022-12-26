import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { NavLink, useFetcher } from "react-router-dom";
import { z } from "zod";
import Editable from "./editable";

const FOLDER = Symbol("Folder");
const ITEM = Symbol("Item");

const menuItemSchema = z.object({
  label: z.string(),
  id: z.string(),
  isFolder: z.boolean(),
});

const itemSchema = menuItemSchema.extend({
  to: z.string(),
  isFolder: z.literal(false),
});

const folderSchema = menuItemSchema.extend({
  isFolder: z.literal(true),
  children: z.array(itemSchema),
});
export const dataSchema = z.array(itemSchema.or(folderSchema));

type MenuData = z.infer<typeof dataSchema>;

const ClosedFolderIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
      />
    </svg>
  );
};

const OpenedFolderIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
      />
    </svg>
  );
};

const Action = ({
  disabled,
  onClick,
  label,
}: {
  disabled?: boolean;
  onClick: any;
  label: string;
}) => {
  return (
    <DropdownMenu.Item
      disabled={disabled}
      onClick={onClick}
      className={`py-2 px-4 w-full text-xs text-left cursor-pointer hover:bg-slate-300 ${
        disabled ? "text-gray-400" : ""
      }`}
    >
      {label}
    </DropdownMenu.Item>
  );
};

const Actions = ({
  setFocus,
  isChild,
  id,
  type,
}: {
  setFocus: any;
  isChild?: boolean;
  id: string;
  type: typeof ITEM | typeof FOLDER;
}) => {
  const fetcher = useFetcher();
  return (
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
        <DropdownMenu.Content
          align="end"
          alignOffset={-15}
          className=" bg-white border py-1 mt-1 w-40 rounded-md  shadow-lg focus:outline-none flex flex-col"
        >
          <Action
            label="Rename"
            onClick={() => {
              setFocus(false);
              setTimeout(() => {
                setFocus(true);
              }, 0);
            }}
          />
          {type === FOLDER && (
            <Action
              disabled={isChild}
              label="Delete"
              onClick={() => {
                let formData = new FormData();
                formData.append("id", id);
                fetcher.submit(formData, {
                  method: "post",
                  action: "/api/delete-folder",
                });
              }}
            />
          )}
          {type === ITEM && !isChild && (
            <Action
              disabled={isChild}
              label="Delete"
              onClick={() => {
                let formData = new FormData();
                formData.append("id", id);
                fetcher.submit(formData, {
                  method: "post",
                  action: "/api/delete-request",
                });
              }}
            />
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const style = (isActive: boolean) => {
  return `p-2 border-b-2 hover:bg-slate-200 hover:cursor-pointer flex justify-between	items-center group ${
    isActive ? "bg-black hover:bg-black text-white hover:text-white" : ""
  }`;
};

const Folder = ({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: any;
}) => {
  const fetcher = useFetcher();
  const [expanded, setExpanded] = useState(true);
  const [isFocused, setFocus] = useState(false);
  return (
    <div>
      <div className={style(false)}>
        <div className="flex gap-1 items-center select-none">
          <div onClick={() => setExpanded(!expanded)}>
            {expanded ? <OpenedFolderIcon /> : <ClosedFolderIcon />}
          </div>
          <Editable
            defaultText={label}
            onUpdate={(title) => {
              let formData = new FormData();
              formData.append("id", id);
              formData.append("new-title", title);
              fetcher.submit(formData, {
                method: "post",
                action: "/api/rename-folder",
              });
            }}
            isFocused={isFocused}
          />
        </div>
        <Actions setFocus={setFocus} type={FOLDER} id={id} />
      </div>
      {expanded && <div className="[&>*]:pl-6">{children}</div>}
    </div>
  );
};

const Item = ({
  id,
  label,
  isChild,
  to,
}: {
  id: string;
  label: string;
  isChild?: boolean;
  to: string;
}) => {
  const [isFocused, setFocus] = useState(false);
  const fetcher = useFetcher();
  return (
    <NavLink className={({ isActive }) => style(isActive)} to={to}>
      <div className="select-none1">
        <Editable
          defaultText={label}
          onUpdate={(title) => {
            let formData = new FormData();
            formData.append("id", id);
            formData.append("new-title", title);
            fetcher.submit(formData, {
              method: "post",
              action: "/api/rename-request",
            });
          }}
          isFocused={isFocused}
        />
      </div>
      <Actions setFocus={setFocus} isChild={isChild} id={id} type={ITEM} />
    </NavLink>
  );
};

export default function ({ data }: { data: MenuData }) {
  return (
    <div className="text-sm ">
      {data.map((item) => {
        return item.isFolder ? (
          <Folder key={item.id} id={item.id} label={item.label}>
            {item.children.map((child) => {
              return (
                <Item
                  key={child.id}
                  id={child.id}
                  to={child.to}
                  label={child.label}
                  isChild={true}
                ></Item>
              );
            })}
          </Folder>
        ) : (
          <Item
            key={item.id}
            id={item.id}
            to={item.to}
            label={item.label}
          ></Item>
        );
      })}
    </div>
  );
}
