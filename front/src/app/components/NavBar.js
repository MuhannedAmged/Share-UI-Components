"use client";

import {
  IconComponents,
  IconHome,
  IconInnerShadowBottomLeft,
  IconLoader,
  IconPlus,
  IconSquareCheck,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const iconSize = 20;
const iconStroke = 1.75;

const links = [
  {
    icon: <IconHome size={iconSize} stroke={iconStroke} />,
    href: "/",
    label: "Home",
  },
  {
    icon: <IconComponents size={iconSize} stroke={iconStroke} />,
    href: "/ui-components",
    label: "UI",
  },
  {
    icon: <IconPlus size={iconSize} stroke={iconStroke} />,
    href: "/dashboard/projects",
    label: "Add",
  },
  {
    icon: <IconUser size={iconSize} stroke={iconStroke} />,
    href: "/auth/sign-in",
    label: "Account",
  },
];

const NavBar = () => {
  const pathname = usePathname();

  return (
    <div className="w-full my-5 flex justify-center">
      <div className="rounded-full flex w-fit items-center justify-center gap-2 py-4 px-8 main-shadow relative">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`text-white flex gap-1 hover:text-sky-400 duration-300 ${
              link.href === pathname ? "!text-sky-400" : ""
            }`}
          >
            {link.icon}
            <p className="max-md:hidden">{link.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
