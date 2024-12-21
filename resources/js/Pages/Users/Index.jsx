import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Link, Head, useForm, router } from "@inertiajs/react";
import {
    ChevronDoubleUpIcon,
    InformationCircleIcon,
    NoSymbolIcon,
    UserPlusIcon,
} from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Tooltip,
} from "@material-tailwind/react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RequestsWriter } from "./RequestsWriter";
import Paginate from "@/Components/Paginate";

const TABS = [
    {
        label: "All",
        value: "all",
    },
    {
        label: "Admin",
        value: "admin",
    },
    {
        label: "Writer",
        value: "Writer",
    },
    {
        label: "Reader",
        value: "Reader",
    },
];

const ROLES = [
    {
        role: "admin",
        color: "indigo",
    },
    {
        role: "writer",
        color: "deep-orange",
    },
    {
        role: "reader",
        color: "teal",
    },
];

const TABLE_HEAD = [
    { label: "Name", key: "name" },
    { label: "Address", key: null },
    { label: "Role", key: null },
    { label: "Join At", key: "created_at" },
    { label: "", key: null },
];

export default function Index({ auth, users, queryParams = {}, flash }) {
    const { delete: destroy, errors } = useForm();
    const { post, processing } = useForm();
    const [selectedTab, setSelectedTab] = useState(queryParams.role || "all");
    const [sortBy, setSortBy] = useState(queryParams.sort_by || "name");
    const [sortOrder, setSortOrder] = useState(queryParams.sort_order || "asc");
    const [openMenu, setOpenMenu] = useState(false);
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(users.current_page);

    const handlePageChange = (page) => {
        setCurrentPage(page);

        if (page === 1) {
            router.replace(
                route("users.index"),
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                }
            );
        } else {
            router.get(
                route("users.index", { page }),
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                }
            );
        }
    };

    const handleOpen = () => setOpen(!open);

    const handlePromotedUser = (userId, role) => {
        post(route("users.promoted", { user: userId, role }), {
            onSuccess: (page) => {
                if (page.props.flash) {
                    toast.success(page.props.flash); // Tampilkan toast saat flash diterima
                }
            },
            onError: (errors) => {
                console.error("Failed to promote user:", errors);
            },
        });
    };

    // Function to handle tab change
    const handleTabChange = (role) => {
        if (role !== "all") {
            setSelectedTab(role);
            queryParams["role"] = role;
            router.get(route("users.index"), queryParams);
        } else {
            delete queryParams["role"];
            router.get(route("users.index"));
        }
    };

    // Function to handle sorting
    const handleSort = (column) => {
        if (!column) return; // Skip if column is not sortable

        // Toggle sort order if the same column is clicked again
        const newSortOrder =
            sortBy === column && sortOrder === "asc" ? "desc" : "asc";
        setSortBy(column);
        setSortOrder(newSortOrder);

        // Update query parameters for sorting
        queryParams["sort_by"] = column;
        queryParams["sort_order"] = newSortOrder;

        // Reload data with the new sorting
        router.get(route("users.index"), queryParams);
    };

    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route("users.index"), queryParams);
    };

    const onKeyUp = (name, e) => {
        if (e.key !== "enter") return;
        searchFieldChanged(name, e.target.value);
    };

    const handleBan = (value) => {
        post(route("users.ban", value));
    };

    const handleUnban = (value) => {
        post(route("users.unban", value));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head
                title={auth.user.roles[0].name == "admin" ? "Users" : "Writers"}
            />
            <div className="container w-full max-w-6xl p-6 mx-auto space-y-6">
                {auth.user.roles[0].name == "admin" ? (
                    <Card className="h-full w-full">
                        <RequestsWriter open={open} handleOpen={handleOpen} />
                        <CardHeader
                            floated={false}
                            shadow={false}
                            className="rounded-none"
                        >
                            <div className="mb-8 flex items-center justify-between gap-8">
                                <div>
                                    <Typography variant="h5" color="blue-gray">
                                        Members list
                                    </Typography>
                                    <Typography
                                        color="gray"
                                        className="mt-1 font-normal"
                                    >
                                        See information about all members
                                    </Typography>
                                </div>
                                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                    <Button
                                        variant="outlined"
                                        size="sm"
                                        onClick={handleOpen}
                                    >
                                        View All
                                    </Button>
                                    <Link href={route("users.create")}>
                                        <Button
                                            className="flex items-center gap-3"
                                            size="sm"
                                        >
                                            <UserPlusIcon
                                                strokeWidth={2}
                                                className="h-4 w-4"
                                            />
                                            Add Member
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                                <Tabs
                                    value={selectedTab}
                                    className="w-full md:w-max"
                                >
                                    <TabsHeader>
                                        {TABS.map(({ label, value }) => (
                                            <Tab
                                                key={value}
                                                value={value}
                                                onClick={() =>
                                                    handleTabChange(value)
                                                }
                                            >
                                                &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                            </Tab>
                                        ))}
                                    </TabsHeader>
                                </Tabs>
                                <div className="w-full md:w-72">
                                    <Input
                                        label="Search"
                                        value={queryParams.name || ""}
                                        icon={
                                            <MagnifyingGlassIcon className="h-5 w-5" />
                                        }
                                        name="search"
                                        onChange={(e) =>
                                            searchFieldChanged(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        onKeyUp={(e) => onKeyUp("name", e)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="overflow-scroll px-0 scrollbar-hide">
                            <table className="mt-4 w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th
                                                key={head.label}
                                                className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 cursor-pointer"
                                                onClick={() =>
                                                    handleSort(head.key)
                                                } // Sorting handler
                                            >
                                                <div className="flex items-center gap-1">
                                                    {/* Flexbox container */}
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal leading-none opacity-70"
                                                    >
                                                        {head.label}
                                                    </Typography>
                                                    {/* Add sorting indicator (↑ or ↓) for sortable columns */}
                                                    {(head.key == "name" ||
                                                        head.key ==
                                                            "created_at") && (
                                                        <span>
                                                            <ChevronUpIcon
                                                                strokeWidth={
                                                                    2.5
                                                                }
                                                                className={`h-3.5 w-3.5 transition-transform duration-300 ${
                                                                    sortBy ===
                                                                        head.key &&
                                                                    sortOrder ===
                                                                        "asc"
                                                                        ? "rotate-180"
                                                                        : "rotate-0"
                                                                }`}
                                                            />
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.length > 0 ? (
                                        users.data.map((user, index) => {
                                            const {
                                                avatar_url,
                                                name,
                                                email,
                                                address,
                                                is_ban,
                                                created_at,
                                            } = user;
                                            const isLast =
                                                index === users.length - 1;
                                            const classes = isLast
                                                ? "p-4"
                                                : "p-4 border-b border-blue-gray-50";

                                            return (
                                                <tr key={index}>
                                                    <td className={classes}>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar
                                                                src={
                                                                    avatar_url ||
                                                                    "http://localhost:8000/no-image.png"
                                                                }
                                                                alt={name}
                                                                size="sm"
                                                            />
                                                            <div className="flex flex-col">
                                                                <Typography
                                                                    variant="small"
                                                                    color={
                                                                        is_ban
                                                                            ? "red"
                                                                            : "blue-gray"
                                                                    }
                                                                    className="font-normal"
                                                                >
                                                                    {name}
                                                                </Typography>
                                                                <Typography
                                                                    variant="small"
                                                                    color="blue-gray"
                                                                    className="font-normal opacity-70"
                                                                >
                                                                    {email}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="truncate font-normal overflow-hidden w-52"
                                                            >
                                                                {address}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        {user.roles.map(
                                                            (role) => (
                                                                <div
                                                                    className="w-max"
                                                                    key={
                                                                        role.name
                                                                    }
                                                                >
                                                                    <Chip
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        value={
                                                                            role.name
                                                                        }
                                                                        color={
                                                                            ROLES.find(
                                                                                (
                                                                                    r
                                                                                ) =>
                                                                                    r.role ===
                                                                                    role.name
                                                                            )
                                                                                ?.color ||
                                                                            "blue-gray"
                                                                        } // Directly find the color or default to "blue-gray"
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {new Date(
                                                                created_at
                                                            ).toLocaleDateString(
                                                                "en-GB"
                                                            )}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Menu>
                                                            <MenuHandler>
                                                                <IconButton variant="text">
                                                                    <ChevronDownIcon className="h-5 w-5" />
                                                                </IconButton>
                                                            </MenuHandler>
                                                            <MenuList className="flex flex-col gap-2">
                                                                {is_ban ? (
                                                                    <>
                                                                        <MenuItem
                                                                            className="flex items-center gap-4 py-2 pl-2 pr-8"
                                                                            onClick={() =>
                                                                                handleUnban(
                                                                                    user.id
                                                                                )
                                                                            }
                                                                        >
                                                                            <NoSymbolIcon className="h-5 w-5" />
                                                                            <Typography
                                                                                variant="small"
                                                                                color="blue-gray"
                                                                                className="font-normal"
                                                                            >
                                                                                Unban
                                                                            </Typography>
                                                                        </MenuItem>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <MenuItem
                                                                            className="flex items-center gap-4 py-2 pl-2 pr-8"
                                                                            onClick={() =>
                                                                                handleBan(
                                                                                    user.id
                                                                                )
                                                                            }
                                                                        >
                                                                            <NoSymbolIcon className="h-5 w-5" />
                                                                            <Typography
                                                                                variant="small"
                                                                                color="blue-gray"
                                                                                className="font-normal"
                                                                            >
                                                                                Ban
                                                                            </Typography>
                                                                        </MenuItem>
                                                                    </>
                                                                )}
                                                                <Menu
                                                                    placement="right-start"
                                                                    open={
                                                                        openMenu
                                                                    }
                                                                    handler={
                                                                        setOpenMenu
                                                                    }
                                                                    allowHover
                                                                    offset={15}
                                                                >
                                                                    <MenuHandler className="flex items-center justify-between">
                                                                        <MenuItem>
                                                                            <ChevronDoubleUpIcon className="h-5 w-5" />
                                                                            Promoted
                                                                            <ChevronUpIcon
                                                                                strokeWidth={
                                                                                    2.5
                                                                                }
                                                                                className={`h-3.5 w-3.5 transition-transform ${
                                                                                    openMenu
                                                                                        ? "rotate-90"
                                                                                        : ""
                                                                                }`}
                                                                            />
                                                                        </MenuItem>
                                                                    </MenuHandler>
                                                                    <MenuList>
                                                                        <MenuItem
                                                                            onClick={() =>
                                                                                handlePromotedUser(
                                                                                    user.id,
                                                                                    "admin"
                                                                                )
                                                                            }
                                                                        >
                                                                            <Typography>
                                                                                Admin
                                                                            </Typography>
                                                                        </MenuItem>
                                                                        <MenuItem
                                                                            onClick={() =>
                                                                                handlePromotedUser(
                                                                                    user.id,
                                                                                    "writer"
                                                                                )
                                                                            }
                                                                        >
                                                                            <Typography>
                                                                                Writer
                                                                            </Typography>
                                                                        </MenuItem>
                                                                        <MenuItem
                                                                            onClick={() =>
                                                                                handlePromotedUser(
                                                                                    user.id,
                                                                                    "reader"
                                                                                )
                                                                            }
                                                                        >
                                                                            <Typography>
                                                                                Reader
                                                                            </Typography>
                                                                        </MenuItem>
                                                                    </MenuList>
                                                                </Menu>
                                                            </MenuList>
                                                        </Menu>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <p className="text-center p-8">
                                            No users yet!
                                        </p>
                                    )}
                                </tbody>
                            </table>
                        </CardBody>
                        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >
                                Page {users.current_page} of {users.last_page}
                            </Typography>
                            <div className="flex gap-2">
                                {users.prev_page_url && (
                                    <Button variant="outlined" size="sm">
                                        <Link href={users.prev_page_url}>
                                            Previous
                                        </Link>
                                    </Button>
                                )}
                                {users.next_page_url && (
                                    <Button variant="outlined" size="sm">
                                        <Link href={users.next_page_url}>
                                            Next
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                ) : (
                    <div className="space-y-4 pl-8">
                        <div className="flex flex-col ml-4 mb-4 mt-6">
                            <Typography variant="small" className="font-normal">
                                The creative creators
                            </Typography>
                            <Typography variant="h1" className="font-bold">
                                Writers
                            </Typography>
                        </div>
                        <div className="flex flex-wrap gap-4 pl-4">
                            {users.data.length > 0 ? (
                                users.data.map((user) => {
                                    const { id, name, email, avatar_url } =
                                        user;
                                    return (
                                        <Card className="w-80" key={id}>
                                            <CardHeader
                                                floated={false}
                                                className="h-56"
                                            >
                                                <img
                                                    src={avatar_url}
                                                    alt={name}
                                                />
                                            </CardHeader>
                                            <CardBody className="text-center">
                                                <Typography
                                                    variant="h4"
                                                    color="blue-gray"
                                                    className="mb-2"
                                                >
                                                    {name}
                                                </Typography>
                                                <Typography
                                                    color="blue-gray"
                                                    className="font-medium"
                                                    textGradient
                                                >
                                                    {email}
                                                </Typography>
                                            </CardBody>
                                            <CardFooter className="flex justify-center gap-7 pt-2">
                                                <Button
                                                    variant="gradient"
                                                    size="sm"
                                                    className="max-w-32"
                                                >
                                                    See Profile
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    );
                                })
                            ) : (
                                <p>No Writer</p>
                            )}
                        </div>
                        <Paginate
                            currentPage={currentPage}
                            totalPages={users.last_page}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
