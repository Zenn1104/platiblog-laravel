import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Link, Head, useForm, router } from "@inertiajs/react";
import {
    CheckIcon,
    ChevronDoubleUpIcon,
    InformationCircleIcon,
    NoSymbolIcon,
    PencilIcon,
    TrashIcon,
    UserPlusIcon,
    XMarkIcon,
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
import Paginate from "@/Components/Paginate";

const TABS = [
    {
        label: "All",
        value: "all",
    },
    {
        label: "Pending",
        value: "pending",
    },
    {
        label: "Approve",
        value: "approve",
    },
    {
        label: "Rejected",
        value: "rejected",
    },
];

const STATUS = [
    {
        status: "pending",
        color: "gray",
    },
    {
        status: "approve",
        color: "teal",
    },
    {
        status: "rejected",
        color: "red",
    },
];

const TABLE_HEAD = [
    { label: "Title", key: "title" },
    { label: "Author", key: null },
    { label: "Category", key: null },
    { label: "Status", key: null },
    { label: "Publish At", key: "created_at" },
    { label: "", key: null },
];

export default function Index({ auth, blogs, queryParams = {}, flash }) {
    const { delete: destroy, errors } = useForm();
    const [selectedTab, setSelectedTab] = useState(
        queryParams.blog_status || "all"
    );
    const [sortBy, setSortBy] = useState(queryParams.sort_by || "name");
    const [sortOrder, setSortOrder] = useState(queryParams.sort_order || "asc");
    const [currentPage, setCurrentPage] = useState(blogs.current_page);

    const handlePageChange = (page) => {
        setCurrentPage(page);

        if (page === 1) {
            router.replace(
                route("blogs.index"),
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                }
            );
        } else {
            router.get(
                route("blogs.index", { page }),
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                }
            );
        }
    };

    // Function to handle tab change
    const handleTabChange = (status) => {
        if (status !== "all") {
            setSelectedTab(status);
            queryParams["blog_status"] = status;
            router.get(route("blogs.index"), queryParams);
        } else {
            delete queryParams["blog_status"];
            router.get(route("blogs.index"));
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
        router.get(route("blogs.index"), queryParams);
    };

    const searchFieldChanged = (title, value) => {
        if (value) {
            queryParams[title] = value;
        } else {
            delete queryParams[title];
        }
        router.get(route("blogs.index"), queryParams);
    };

    const onKeyUp = (title, e) => {
        if (e.key !== "enter") return;
        searchFieldChanged(title, e.target.value);
    };

    const handleApprove = (id) => {
        router.post(route("blogs.approve", { id: id }));
    };

    const handleReject = (id) => {
        router.post(route("blogs.reject", { id: id }));
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this blogs?")) {
            destroy(route("blogs.destroy", { blog: id }), {
                onError: (errors) => {
                    console.error(errors);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Blogs" />
            <div className="container w-full max-w-6xl p-6 mx-auto space-y-6">
                {(auth.user.roles[0].name === "admin" ||
                    auth.user.roles[0].name === "writer") && (
                    <Card className="h-full w-full">
                        <CardHeader
                            floated={false}
                            shadow={false}
                            className="rounded-none"
                        >
                            <div className="mb-8 flex items-center justify-between gap-8">
                                <div>
                                    <Typography variant="h5" color="blue-gray">
                                        Blogs list
                                    </Typography>
                                    <Typography
                                        color="gray"
                                        className="mt-1 font-normal"
                                    >
                                        See information about all Blogs.
                                    </Typography>
                                </div>
                                {auth.user.roles[0].name === "writer" && (
                                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                        <Link href={route("blogs.create")}>
                                            <Button
                                                className="flex items-center gap-3"
                                                size="sm"
                                            >
                                                <UserPlusIcon
                                                    strokeWidth={2}
                                                    className="h-4 w-4"
                                                />{" "}
                                                Add Blog
                                            </Button>
                                        </Link>
                                    </div>
                                )}
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
                                                &nbsp;&nbsp;{label}
                                                &nbsp;&nbsp;
                                            </Tab>
                                        ))}
                                    </TabsHeader>
                                </Tabs>
                                <div className="w-full md:w-72">
                                    <Input
                                        label="Search"
                                        value={queryParams.title || ""}
                                        icon={
                                            <MagnifyingGlassIcon className="h-5 w-5" />
                                        }
                                        name="search"
                                        onChange={(e) =>
                                            searchFieldChanged(
                                                "title",
                                                e.target.value
                                            )
                                        }
                                        onKeyUp={(e) => onKeyUp("title", e)}
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
                                                    {(head.key == "title" ||
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
                                    {blogs.data.length > 0 ? (
                                        blogs.data.map((blog, index) => {
                                            const {
                                                id,
                                                thumbnail_url,
                                                title,
                                                blog_status,
                                                created_at,
                                            } = blog;
                                            const isLast =
                                                index === blogs.length - 1;
                                            const classes = isLast
                                                ? "p-4"
                                                : "p-4 border-b border-blue-gray-50";
                                            return (
                                                <tr key={index}>
                                                    <td className={classes}>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar
                                                                src={
                                                                    thumbnail_url ||
                                                                    "http://localhost:8000/no-image.png"
                                                                }
                                                                alt={title}
                                                                size="sm"
                                                                variant="square"
                                                            />
                                                            <div className="flex flex-col">
                                                                <Typography
                                                                    variant="small"
                                                                    color={
                                                                        "blue-gray"
                                                                    }
                                                                    className="font-normal hover:underline"
                                                                >
                                                                    <Link
                                                                        href={route(
                                                                            "blogs.show",
                                                                            {
                                                                                id: id,
                                                                            }
                                                                        )}
                                                                    >
                                                                        {title}
                                                                    </Link>
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {
                                                                    blog.writer
                                                                        .name
                                                                }
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {
                                                                    blog
                                                                        .category
                                                                        .name
                                                                }
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="w-max">
                                                            <Chip
                                                                variant="ghost"
                                                                size="sm"
                                                                value={
                                                                    blog_status
                                                                }
                                                                color={
                                                                    STATUS.find(
                                                                        (s) =>
                                                                            s.status ===
                                                                            blog_status
                                                                    )?.color ||
                                                                    "blue-gray"
                                                                } // Directly find the color or default to "blue-gray"
                                                            />
                                                        </div>
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
                                                        {auth.roles[0] ===
                                                        "admin" ? (
                                                            <>
                                                                <IconButton
                                                                    color="teal"
                                                                    variant="gradient"
                                                                    size="sm"
                                                                    className="mr-2"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        handleApprove(
                                                                            id
                                                                        );
                                                                    }}
                                                                >
                                                                    <CheckIcon className="w-5 h-5" />
                                                                </IconButton>
                                                                <IconButton
                                                                    color="red"
                                                                    variant="gradient"
                                                                    size="sm"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        handleReject(
                                                                            id
                                                                        );
                                                                    }}
                                                                >
                                                                    <XMarkIcon className="w-5 h-5" />
                                                                </IconButton>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Tooltip content="Edit Category">
                                                                    <Link
                                                                        href={`blogs/edit/${blog.id}`}
                                                                    >
                                                                        <IconButton variant="text">
                                                                            <PencilIcon className="h-4 w-4" />
                                                                        </IconButton>
                                                                    </Link>
                                                                </Tooltip>
                                                                <Tooltip content="Delete Category">
                                                                    <IconButton
                                                                        variant="text"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                id
                                                                            )
                                                                        }
                                                                    >
                                                                        <TrashIcon className="h-4 w-4" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <p className="text-center p-8">
                                            No blogs yet!
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
                                Page {blogs.current_page} of {blogs.last_page}
                            </Typography>
                            <div className="flex gap-2">
                                {blogs.prev_page_url && (
                                    <Button variant="outlined" size="sm">
                                        <Link href={blogs.prev_page_url}>
                                            Previous
                                        </Link>
                                    </Button>
                                )}
                                {blogs.next_page_url && (
                                    <Button variant="outlined" size="sm">
                                        <Link href={blogs.next_page_url}>
                                            Next
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                )}
                {auth.user.roles[0].name === "reader" && (
                    <>
                        <div className="flex gap-2 flex-wrap mx-auto gap-y-6">
                            {blogs.data.length > 0 ? (
                                blogs.data.map((blog, index) => {
                                    const {
                                        id,
                                        title,
                                        thumbnail_url,
                                        created_at,
                                    } = blog;
                                    return (
                                        <Card
                                            key={index}
                                            className="mt-6 w-60 mx-auto"
                                        >
                                            <CardHeader
                                                color="blue-gray"
                                                className="relative h-44"
                                                floated={false}
                                            >
                                                <img
                                                    src={thumbnail_url}
                                                    alt={title}
                                                    className="object-cover object-center"
                                                />
                                            </CardHeader>
                                            <CardBody>
                                                <div className="w-max my-2">
                                                    <Chip
                                                        variant="ghost"
                                                        size="sm"
                                                        value={
                                                            blog.category.name
                                                        }
                                                        color="gray"
                                                    />
                                                </div>
                                                <Typography
                                                    variant="h5"
                                                    color="blue-gray"
                                                    className="mb-2 w-42 overflow-hidden truncate"
                                                >
                                                    {title}
                                                </Typography>
                                                <Typography
                                                    variant="small"
                                                    color="gray"
                                                    className="mb-2"
                                                >
                                                    by{" "}
                                                    <Link
                                                        href={route(
                                                            "writer.profile",
                                                            blog.writer.id
                                                        )}
                                                        className="hover:underline"
                                                    >
                                                        {blog.writer.name}
                                                    </Link>{" "}
                                                    at{" "}
                                                    {new Date(
                                                        created_at
                                                    ).toLocaleDateString(
                                                        "en-GB"
                                                    )}
                                                </Typography>
                                            </CardBody>
                                            <CardFooter className="pt-0">
                                                <Link
                                                    href={route(
                                                        "blogs.show",
                                                        id
                                                    )}
                                                >
                                                    <Button variant="gradient">
                                                        Read More...
                                                    </Button>
                                                </Link>
                                            </CardFooter>
                                        </Card>
                                    );
                                })
                            ) : (
                                <p className="text-center p-8">No blogs yet!</p>
                            )}
                        </div>
                        <Paginate
                            currentPage={currentPage}
                            totalPages={blogs.last_page}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
