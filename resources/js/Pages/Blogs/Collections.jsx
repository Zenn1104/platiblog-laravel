import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Paginate from "@/Components/Paginate";
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
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
} from "@material-tailwind/react";

export default function Collections({ auth, collections }) {
    const [currentPage, setCurrentPage] = React.useState(
        collections.current_page
    ); // Inisialisasi dengan halaman saat ini dari data blogs
    console.log(collections);
    const handlePageChange = (page) => {
        setCurrentPage(page);

        if (page === 1) {
            router.replace(
                route("collections.index"),
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                }
            );
        } else {
            router.get(
                route("collections.index", { page }),
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                }
            );
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Blogs" />
            <div className="container w-full max-w-6xl p-6 mx-auto space-y-6">
                <>
                    <div className="flex flex-col ml-4 mb-4 mt-6">
                        <Typography variant="small" className="font-normal">
                            Collect The News What ever you want
                        </Typography>
                        <Typography variant="h1" className="font-bold">
                            Collection
                        </Typography>
                    </div>
                    <div className="flex gap-2 flex-wrap mx-auto gap-y-6">
                        {collections.length > 0 ? (
                            collections.map((blog, index) => {
                                const { id, title, thumbnail_url, created_at } =
                                    blog;
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
                                                    value={blog.category.name}
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
                                                by {blog.writer.name} at{" "}
                                                {new Date(
                                                    created_at
                                                ).toLocaleDateString("en-GB")}
                                            </Typography>
                                        </CardBody>
                                        <CardFooter className="pt-0">
                                            <Link
                                                href={route("blogs.show", id)}
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
                            <p className="text-center p-8">
                                No collections yet!
                            </p>
                        )}
                    </div>
                    <Paginate
                        currentPage={currentPage}
                        totalPages={collections?.last_page}
                        onPageChange={handlePageChange}
                    />
                </>
            </div>
        </AuthenticatedLayout>
    );
}
