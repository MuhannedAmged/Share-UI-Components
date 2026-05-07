"use client";

import {
  IconDeviceFloppy,
  IconLogin2,
  IconPlus,
  IconSquareDashed,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const iconSize = 20;
const iconStroke = 1.75;

const NavBarMain = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const links = [
    {
      icon: <IconDeviceFloppy size={iconSize} stroke={iconStroke} />,
      href: "/dashboard/saved",
      label: "Saved",
    },
    {
      icon: <IconPlus size={iconSize} stroke={iconStroke} />,
      href: "/dashboard/projects",
      label: "Add",
    },
    {
      icon: isLoggedIn ? (
        <IconSquareDashed size={iconSize} stroke={iconStroke} />
      ) : (
        <IconLogin2 size={iconSize} stroke={iconStroke} />
      ),
      href: isLoggedIn ? "/dashboard" : "/auth/sign-up",
      label: isLoggedIn ? "Dashboard" : "Sign Up",
    },
  ];

  return (
    <div className="mb-6 flex w-full items-center justify-end max-md:justify-center gap-6 max-md:gap-4 py-4 px-8 max-md:px-4 bg-white/5 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-gray-300 flex gap-2 hover:text-sky-400 duration-300 items-center text-sm font-medium transition-all hover:translate-y-[-1px]"
        >
          <span className="p-1.5 rounded-lg bg-white/5 group-hover:bg-sky-500/10 transition-colors">
            {link.icon}
          </span>
          <p className="max-md:hidden">{link.label}</p>
        </Link>
      ))}
    </div>
  );
};

export default NavBarMain;
