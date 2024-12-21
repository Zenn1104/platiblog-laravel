import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, Head, useForm, router } from "@inertiajs/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    CardFooter,
    IconButton,
    Tooltip,
    List,
    ListItem,
    ListItemPrefix,
    Chip,
} from "@material-tailwind/react";
import { useState } from "react";
import { debounce } from "lodash";
import Paginate from "@/Components/Paginate";

const TABLE_HEAD = ["name", "slug", "description", ""];

export default function Index({ auth, categories, queryParams = null }) {
    const { delete: destroy, errors } = useForm();
    queryParams = queryParams || {};

    const [searchQuery, setSearchQuery] = useState(queryParams.name || "");
    const [currentPage, setCurrentPage] = useState(categories.current_page);
    console.log(categories);
    const handlePageChange = (page) => {
        setCurrentPage(page);

        if (page === 1) {
            router.replace(
                route("categories.index"),
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                }
            );
        } else {
            router.get(
                route("categories.index", { page }),
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                }
            );
        }
    };

    // Optimized debounced search function using lodash debounce
    const handleSearch = debounce((value) => {
        if (value) {
            queryParams.name = value;
        } else {
            delete queryParams.name;
        }

        router.get(route("categories.index"), queryParams, {
            preserveState: true,
            replace: true,
        });
    }, 300); // 300ms delay before sending the request

    // Handler for search input change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value); // Update local state for input value
        handleSearch(value); // Call debounced search function
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            destroy(route("categories.destroy", { category: id }), {
                onError: (errors) => {
                    console.error(errors);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="categories" />
            <div className="container w-full max-w-6xl p-6 mx-auto space-y-6">
                {auth.user.roles[0].name == "admin" ? (
                    <Card className="h-full w-full">
                        <CardHeader
                            floated={false}
                            shadow={false}
                            className="rounded-none"
                        >
                            <div className="mb-8 flex items-center justify-between gap-8">
                                <div>
                                    <Typography variant="h5" color="blue-gray">
                                        Category list
                                    </Typography>
                                    <Typography
                                        color="gray"
                                        className="mt-1 font-normal"
                                    >
                                        See information about all categories
                                    </Typography>
                                </div>
                                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                    <Link href={route("categories.create")}>
                                        <Button
                                            className="flex items-center gap-3"
                                            size="sm"
                                        >
                                            <UserPlusIcon
                                                strokeWidth={2}
                                                className="h-4 w-4"
                                            />{" "}
                                            Add Category
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                                <div className="w-full md:w-72 flex-end">
                                    <Input
                                        label="Search"
                                        value={searchQuery} // Bind input value to state
                                        icon={
                                            <MagnifyingGlassIcon className="h-5 w-5" />
                                        }
                                        name="search"
                                        onChange={handleInputChange} // Handle input change
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="overflow-scroll px-0">
                            <table className="mt-4 w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th
                                                key={head}
                                                className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none opacity-70"
                                                >
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories?.data?.length > 0 ? (
                                        categories.data.map(
                                            (category, index) => {
                                                const {
                                                    id,
                                                    name,
                                                    slug,
                                                    description,
                                                } = category;
                                                const isLast =
                                                    index ===
                                                    categories.length - 1;
                                                const classes = isLast
                                                    ? "p-4"
                                                    : "p-4 border-b border-blue-gray-50";

                                                return (
                                                    <tr key={name}>
                                                        <td className={classes}>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex flex-col">
                                                                    <Typography
                                                                        variant="small"
                                                                        color="blue-gray"
                                                                        className="font-normal"
                                                                    >
                                                                        {name}
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
                                                                    {slug}
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
                                                                        description
                                                                    }
                                                                </Typography>
                                                            </div>
                                                        </td>
                                                        <td className={classes}>
                                                            <Tooltip content="Edit Category">
                                                                <Link
                                                                    href={`/categories/${id}/edit`}
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
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )
                                    ) : (
                                        <p className="text-center p-8">
                                            No categories yet!
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
                                Page {categories.current_page} of{" "}
                                {categories.last_page}
                            </Typography>
                            <div className="flex gap-2">
                                {categories.prev_page_url && (
                                    <Button variant="outlined" size="sm">
                                        <Link href={categories.prev_page_url}>
                                            Previous
                                        </Link>
                                    </Button>
                                )}
                                {categories.next_page_url && (
                                    <Button variant="outlined" size="sm">
                                        <Link href={categories.next_page_url}>
                                            Next
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="max-w-8xl m-6">
                        {categories.data.length > 0 ? (
                            categories.data.map((category) => {
                                const { id, name, slug, description } =
                                    category;
                                return (
                                    <List key={id}>
                                        <ListItem>
                                            <div>
                                                <Typography
                                                    variant="h3"
                                                    color="blue-gray"
                                                >
                                                    #{name}
                                                </Typography>
                                                <Typography
                                                    variant="small"
                                                    color="gray"
                                                    className="font-normal"
                                                >
                                                    {description}
                                                </Typography>
                                                {category.blogs.length > 0 ? (
                                                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                                                        {category.blogs.map(
                                                            (blog) => {
                                                                const {
                                                                    id,
                                                                    title,
                                                                    thumbnail_url,
                                                                    created_at,
                                                                } = blog;

                                                                return (
                                                                    <Card
                                                                        key={id}
                                                                        className="w-full"
                                                                    >
                                                                        <CardHeader
                                                                            color="blue-gray"
                                                                            className="relative h-44"
                                                                            floated={
                                                                                false
                                                                            }
                                                                        >
                                                                            <img
                                                                                src={
                                                                                    thumbnail_url
                                                                                }
                                                                                alt={
                                                                                    title
                                                                                }
                                                                                className="object-cover object-center"
                                                                            />
                                                                        </CardHeader>
                                                                        <CardBody>
                                                                            <Typography
                                                                                variant="h5"
                                                                                color="blue-gray"
                                                                                className="mb-2 truncate"
                                                                            >
                                                                                {
                                                                                    title
                                                                                }
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
                                                                                        blog
                                                                                            .writer
                                                                                            .id
                                                                                    )}
                                                                                    className="hover:underline"
                                                                                >
                                                                                    {
                                                                                        blog
                                                                                            .writer
                                                                                            .name
                                                                                    }
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
                                                                                    Read
                                                                                    More...
                                                                                </Button>
                                                                            </Link>
                                                                        </CardFooter>
                                                                    </Card>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p>Belum ada blog</p>
                                                )}
                                            </div>
                                        </ListItem>
                                    </List>
                                );
                            })
                        ) : (
                            <p>Belum Ada Category</p>
                        )}
                        <Paginate
                            currentPage={currentPage}
                            totalPages={categories.last_page}
                            onPageChange={handlePageChange}
                        />
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
