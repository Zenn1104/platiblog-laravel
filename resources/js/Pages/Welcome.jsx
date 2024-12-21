import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import { Link, Head, usePage } from "@inertiajs/react";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    Typography,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function Welcome({ auth, blogs }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000); // Perbarui setiap menit

        return () => clearInterval(intervalId);
    }, []);

    const handleClick = () => {
        if (auth?.user) {
            router.get(route("writer.join"));
        } else {
            alert("You need to log in to join as a writer!");
        }
    };

    const handleImageError = () => {
        document.getElementById("screenshot-container")?.classList.add("!hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document.getElementById("docs-card-content")?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("!hidden");
    };

    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);
    const handleOpen = () => setOpenModal(!openModal);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar
                openDrawer={openDrawer}
                closeDrawer={closeDrawer}
                handleOpen={handleOpen}
                setShowingNavigationDropdown={setShowingNavigationDropdown}
                showingNavigationDropdown={showingNavigationDropdown}
                open={open}
                user={auth?.user || null} // Fallback to null jika tidak ada user
            />
            <main>
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
                                    Make your day in Platiblog where the blog is
                                    new everyday, if you want to join with us
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="text-slate font-normal"
                                >
                                    click the button below.
                                </Typography>
                            </div>
                            <Button
                                variant="gradient"
                                className="uppercase max-w-32"
                                onClick={handleClick}
                            >
                                Join Writer
                            </Button>
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
                                                <Link
                                                    href={route(
                                                        "categories.show",
                                                        blog.category?.id || "#"
                                                    )}
                                                >
                                                    <Chip
                                                        variant="ghost"
                                                        size="sm"
                                                        value={blog.category?.name || "Uncategorized"}
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
                                                        blog.writer?.id || "#"
                                                    )}
                                                    className="hover:underline"
                                                >
                                                    {blog.writer?.name || "Unknown"}
                                                </Link>{" "}
                                                at{" "}
                                                {new Date(
                                                    created_at
                                                ).toLocaleDateString("en-GB")}
                                            </Typography>
                                        </CardBody>
                                        <CardFooter className="pt-0">
                                            <Link
                                                href={route("blogs.show", id)}
                                            >
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
                            className="max-w-32 mt-8 mx-auto"
                        >
                            Load More
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
