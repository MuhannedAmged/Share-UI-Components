import {
  IconComponents,
  IconDeviceFloppy,
  IconFolder,
  IconSettings,
  IconSquareDashed,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const iconSize = 20;
const iconStroke = 1.75;

const links = [
  {
    icon: <IconFolder size={iconSize} stroke={iconStroke} />,
    href: "/dashboard/projects",
    label: "Projects",
  },
  {
    icon: <IconDeviceFloppy size={iconSize} stroke={iconStroke} />,
    href: "/dashboard/saved",
    label: "Saved",
  },
];

const SideBar = () => {
  const pathName = usePathname();

  return (
    <div className="h-screen w-54 max-md:w-15 max-md:overflow-x-hidden overflow-y-hidden border-1 border-gray-900">
      <div className="h-full fixed top-0 left-0 text-white p-8 max-md:p-5 !pb-38">
        <div>
          <IconSquareDashed
            className="min-md:hidden"
            size={iconSize}
            stroke={iconStroke}
          />
          <h3 className="max-md:hidden">Dashboard</h3>
        </div>
        <div className="my-5 mb-10 h-full flex flex-col">
          <div className="grow flex flex-col gap-2.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex gap-1 hover:text-sky-400 ${
                  link.href === pathName ? "text-sky-400" : ""
                } duration-300`}
              >
                {link.icon}
                <p className="max-md:hidden">{link.label}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <Link
            href={"/ui-components"}
            className={`flex gap-1 hover:text-sky-400 duration-300`}
          >
            <IconComponents size={iconSize} stroke={iconStroke} />
            <p className="max-md:hidden">UI</p>
          </Link>
          <Link
            href={"/dashboard/settings"}
            className={`flex gap-1 hover:text-sky-400 duration-300`}
          >
            <IconSettings size={iconSize} stroke={iconStroke} />
            <p className="max-md:hidden">Settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
