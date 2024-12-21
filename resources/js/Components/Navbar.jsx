import ApplicationLogo from "@/Components/ApplicationLogo";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import Search from "@/Components/Search";
import {
    Avatar,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemPrefix,
    Menu,
    MenuHandler,
    MenuItem,
    MenuList,
    Typography,
} from "@material-tailwind/react";
import {
    Bars2Icon,
    BellIcon,
    ClockIcon,
    NewspaperIcon,
    QueueListIcon,
    RectangleGroupIcon,
    UserGroupIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import { Link, router } from "@inertiajs/react";
import NotificationList from "./NotificationList";

const Navbar = ({
    openDrawer,
    closeDrawer,
    handleOpen,
    setShowingNavigationDropdown,
    showingNavigationDropdown,
    open,
    user,
    notifications,
}) => {
    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left Section */}
                    <div className="flex">
                        <div className="flex">
                            <IconButton
                                variant="text"
                                className="mt-3"
                                onClick={openDrawer}
                            >
                                <Bars2Icon className="w-5 h-5" />
                            </IconButton>
                            <Drawer open={open} onClose={closeDrawer}>
                                <div className="mb-2 flex items-center justify-between p-4">
                                    <Typography variant="h5" color="blue-gray">
                                        <Link href="/">
                                            <ApplicationLogo className="h-9 w-auto fill-current text-gray-900 dark:text-gray-200" />
                                        </Link>
                                    </Typography>
                                    <IconButton
                                        variant="text"
                                        color="blue-gray"
                                        onClick={closeDrawer}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </IconButton>
                                </div>
                                <List>
                                    {/* Navigation Links */}
                                    <ListItem>
                                        <Link
                                            href={route("dashboard")}
                                            className="flex"
                                            onClick={closeDrawer}
                                        >
                                            <ListItemPrefix>
                                                <RectangleGroupIcon className="h-5 w-5" />
                                            </ListItemPrefix>
                                            Dashboard
                                        </Link>
                                    </ListItem>
                                    <ListItem>
                                        <Link
                                            href={route("users.index")}
                                            className="flex"
                                            onClick={closeDrawer}
                                        >
                                            <ListItemPrefix>
                                                <UserGroupIcon className="w-5 h-5" />
                                            </ListItemPrefix>
                                            {user?.roles[0]?.name === "admin" ||
                                            user !== ""
                                                ? "Users"
                                                : "Writers"}
                                        </Link>
                                    </ListItem>
                                    <ListItem>
                                        <Link
                                            href={route("categories.index")}
                                            className="flex"
                                            onClick={closeDrawer}
                                        >
                                            <ListItemPrefix>
                                                <QueueListIcon className="w-5 h-5" />
                                            </ListItemPrefix>
                                            Categories
                                        </Link>
                                    </ListItem>
                                    <ListItem>
                                        <Link
                                            href={route("blogs.index")}
                                            className="flex"
                                            onClick={closeDrawer}
                                        >
                                            <ListItemPrefix>
                                                <NewspaperIcon className="w-5 h-5" />
                                            </ListItemPrefix>
                                            Blogs
                                        </Link>
                                    </ListItem>
                                    <ListItem>
                                        <Link
                                            href={route("collections.index")}
                                            className="flex"
                                            onClick={closeDrawer}
                                        >
                                            <ListItemPrefix>
                                                <NewspaperIcon className="w-5 h-5" />
                                            </ListItemPrefix>
                                            Collections
                                        </Link>
                                    </ListItem>
                                </List>
                                <Button className="mt-3 ml-5" size="sm">
                                    Documentation
                                </Button>
                            </Drawer>
                            <Search />
                        </div>
                    </div>

                    {/* Center Section */}
                    <div className="shrink-0 flex items-center">
                        <Link href="/">
                            <ApplicationLogo className="block h-9 w-auto fill-current text-gray-900 dark:text-gray-200" />
                        </Link>
                    </div>

                    {/* Right Section */}
                    {user === null ? (
                        <div className="flex gap-2 items-center">
                            <Button
                                variant="gradient"
                                size="sm"
                                onClick={() => router.get(route("login"))}
                            >
                                Sign in
                            </Button>
                            <Button
                                variant="outlined"
                                size="sm"
                                onClick={() => router.get(route("register"))}
                            >
                                Sign up
                            </Button>
                        </div>
                    ) : (
                        <div className="gap-4 flex items-center ms-6">
                            {/* Notification Menu */}
                            <Menu placement="bottom-end">
                                <MenuHandler>
                                    <BellIcon className="h-5 w-5" />
                                </MenuHandler>
                                <NotificationList />
                            </Menu>
                            {/* User Menu */}
                            <Menu placement="bottom-end">
                                <MenuHandler>
                                    <Avatar
                                        variant="circular"
                                        alt="user-avatar"
                                        size="xs"
                                        src={
                                            user.avatar_url ||
                                            "http://localhost:8000/storage/no-image.png"
                                        }
                                    />
                                </MenuHandler>
                                <MenuList>
                                    <MenuItem>
                                        <Link
                                            href={route("profile.edit")}
                                            className="flex items-center gap-2"
                                        >
                                            My Profile
                                        </Link>
                                    </MenuItem>
                                    <hr className="my-2 border-blue-gray-50" />
                                    <MenuItem>
                                        <Link
                                            className="flex items-center gap-2 "
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Logout
                                        </Link>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
