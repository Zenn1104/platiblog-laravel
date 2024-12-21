import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, Head, router } from "@inertiajs/react";
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import StatisticsWidget from "@/Components/StatisticsWidget";

export default function Dashboard({
    auth,
    blogs: initialBlogs,
    queryParams,
    statistics,
}) {
    const [blogs, setBlogs] = useState(initialBlogs.data);
    const [page, setPage] = useState(2);
    const [currentDate, setCurrentDate] = useState(new Date());

    const loadMoreBlogs = () => {
        if (blogs.length > initialBlogs.data.length) {
            // Reset to the first page blogs and remove 'page' parameter from URL
            router.get(
                route("dashboard"),
                {},
                {
                    replace: true,
                    onSuccess: ({ props }) => {
                        setBlogs(props.blogs.data); // Set data back to initial blogs
                        setPage(2); // Reset page counter to 2
                    },
                }
            );
        } else {
            // Fetch the next page if loading more
            router.get(
                route("dashboard", { page }),
                {},
                {
                    replace: false,
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: ({ props }) => {
                        const newBlogs = props.blogs.data;
                        setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
                        setPage(page + 1); // Increment page number
                    },
                }
            );
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000); // Perbarui setiap menit

        return () => clearInterval(intervalId);
    }, []);

    const handleClick = () => {
        router.get(route("writer.join"));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="container w-full max-w-6xl p-6 mx-auto space-y-6">
                <div className="py-8">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <Typography
                            variant="small"
                            className="text-slate font-normal"
                        >
                            {format(currentDate, "EEEE, dd MMMM yyyy HH:mm")}
                        </Typography>
                        <div className="">
                            <Typography variant="h1" className="font-bold">
                                Discover a New News
                            </Typography>
                            <Typography variant="h1" className="font-bold">
                                Everyday
                            </Typography>
                        </div>
                        <div>
                            <Typography
                                variant="small"
                                className="text-slate font-normal"
                            >
                                Make your day in Platiblog where the blog is new
                                everyday, if you wan`t to join with us
                            </Typography>
                            <Typography
                                variant="small"
                                className="text-slate font-normal"
                            >
                                {" "}
                                click the button below.
                            </Typography>
                        </div>
                        {auth.user.roles[0].name === "reader" ? (
                            <Button
                                variant="gradient"
                                className="uppercase max-w-32"
                                onClick={handleClick}
                            >
                                Join Writer
                            </Button>
                        ) : (
                            <StatisticsWidget
                                statistics={statistics}
                                role={auth.user.roles[0].name}
                            />
                        )}
                    </div>
                </div>
                <div className="flex flex-col ml-4 -mb-4 mt-6">
                    <Typography variant="small" className="font-normal">
                        Browse and Read the Latest Stuff
                    </Typography>
                    <Typography variant="h3" className="font-bold">
                        Latest Blog
                    </Typography>
                </div>
                <div className="flex gap-2 flex-wrap mx-auto gap-y-6">
                    {blogs.length > 0 ? (
                        blogs.map((blog, index) => {
                            const { id, title, thumbnail_url, created_at } =
                                blog;
                            return (
                                <Card key={index} className="mt-6 w-60 mx-auto">
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
                                            <Link
                                                href={route(
                                                    "categories.show",
                                                    blog.category.id
                                                )}
                                            >
                                                <Chip
                                                    variant="ghost"
                                                    size="sm"
                                                    value={blog.category.name}
                                                    color="gray"
                                                />
                                            </Link>
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
                                            ).toLocaleDateString("en-GB")}
                                        </Typography>
                                    </CardBody>
                                    <CardFooter className="pt-0">
                                        <Link href={route("blogs.show", id)}>
                                            <Button
                                                variant="gradient"
                                                size="sm"
                                            >
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
                <div className="flex flex-col items-center justify-center">
                    <Button
                        variant="gradient"
                        onClick={loadMoreBlogs}
                        className="max-w-32 mt-8 mx-auto"
                    >
                        {blogs.length > initialBlogs.data.length
                            ? "Show Less"
                            : "Load More"}
                    </Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
