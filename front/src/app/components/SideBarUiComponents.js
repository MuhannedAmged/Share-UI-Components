import {
  IconSquareDashed,
  IconClick,
  IconKeyboard,
  IconId,
  IconWindow,
  IconBell,
  IconForms,
  IconBrandOpenSource,
  IconDots,
  IconBorderAll,
  IconLogin2,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const iconSize = 20;
const iconStroke = 1.75;

const links = [
  {
    icon: <IconBorderAll size={iconSize} stroke={iconStroke} />,
    href: "/ui-components",
    label: "All",
  },
  {
    icon: <IconClick size={iconSize} stroke={iconStroke} />,
    href: "/ui-components/button",
    label: "Button",
  },
  {
    icon: <IconKeyboard size={iconSize} stroke={iconStroke} />,
    href: "/ui-components/input",
    label: "Input",
  },
  {
    icon: <IconId size={iconSize} stroke={iconStroke} />,
    href: "/ui-components/card",
    label: "Card",
  },
  {
    icon: <IconWindow size={iconSize} stroke={iconStroke} />,
    href: "/ui-components/modal",
    label: "Modal",
  },
  {
    icon: <IconBell size={iconSize} stroke={iconStroke} />,
    href: "/ui-components/toast",
    label: "Toast",
  },
  {
    icon: <IconForms size={iconSize} stroke={iconStroke} />,
    href: "/ui-components/form",
    label: "Form",
  },
  {
    icon: <IconBrandOpenSource size={iconSize} stroke={iconStroke} />,
    href: "/ui-components/animation",
    label: "Animation",
  },
  {
    icon: <IconDots size={iconSize} stroke={iconStroke} />,
    href: "/ui-components/other",
    label: "Other",
  },
];

const ComponentsSidebar = () => {
  const pathName = usePathname();
  return (
    <div className="h-screen w-54 max-md:w-15 max-md:overflow-x-hidden overflow-y-hidden border-1 border-gray-900">
      <div className="h-full fixed top-0 left-0 text-white p-8 max-md:p-5 !pb-32">
        <div>
          <IconSquareDashed
            className="min-md:hidden"
            size={iconSize}
            stroke={iconStroke}
          />
          <h3 className="max-md:hidden">UI Components</h3>
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
        <div>
          {localStorage.getItem("token") ? (
            <Link
              href={"/dashboard"}
              className={`flex gap-1 hover:text-sky-400 duration-300`}
            >
              <IconSquareDashed size={iconSize} stroke={iconStroke} />
              <p className="max-md:hidden">Dashboard</p>
            </Link>
          ) : (
            <Link
              href={"/auth/sign-up"}
              className={`flex gap-1 hover:text-sky-400 duration-300`}
            >
              <IconLogin2 size={iconSize} stroke={iconStroke} />
              <p className="max-md:hidden">SignUp</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentsSidebar;
