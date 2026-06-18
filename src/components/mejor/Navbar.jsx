import Image from "next/image";
import Link from "next/link";
import DropDownMenu from "../minor/DropDownMenu";
import NavLink from "../minor/NavLink";

import avatar from "@/assets/user.png";

const Navbar = () => {
  const menus = [
    { name: "Home", href: "/" },
    { name: "Browse Tasks", href: "/browse-task" },
    { name: "Browse Freelancers", href: "/browse-freelancer" },
  ];

  return (
    <header className=" z-50 py-3">
      <nav className="mx-auto flex w-[95%] items-center justify-between rounded-2xl border border-base-300 px-4 py-3 shadow-md  lg:w-[76%]">
        
        {/* Left */}
        <div className="flex items-center gap-2">
          <DropDownMenu menus={menus} />

          <Link
            href="/"
            className="md:text-xl text-lg font-bold tracking-tight"
          >
            <span className="">Freelance</span>
            <span className="">-Terminal</span>
          </Link>
        </div>

        {/* Center */}
        <ul className="hidden lg:flex items-center gap-12">
          {menus.map((menu) => (
            <li key={menu.href}>
              <NavLink href={menu.href}>
                <span className="font-medium transition-colors hover:text-primary">
                  {menu.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="flex items-center">
          <Link href="/profile" >
          <Image
            src={avatar}
            alt="User"
            width={36}
            height={36}
            className="rounded-full border border-base-300 mr-2" 
          />
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-base-300 px-3 py-2 text-sm font-medium transition hover:bg-base-200 mr-2"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-xl border bg-primary px-2 py-2 text-sm font-medium text-primary-content transition hover:opacity-90"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;