import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    CardFooter,
    Chip,
    Avatar,
} from "@material-tailwind/react";

export default function ProfileWriter({ auth, writer }) {
    // Cek apakah data writer ada
    console.log(writer);
    if (!writer) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <div className="flex justify-center items-center min-h-screen">
                    <Typography variant="h4" color="red">
                        Writer not found.
                    </Typography>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={writer.name} />
            <section className="container w-full pb-10 pt-20 px-6 max-w-7xl mx-auto flex flex-col gap-10">
                {/* Profil Writer */}
                <div className="w-1/2 px-6 pb-6 pt-20 flex flex-col justify-center items-center bg-white/50 border-[5px] border-black shadow-lg rounded-[30px] relative h-fit mx-auto">
                    <div className="w-11/12 bg-black border-[5px] border-white/50 rounded-[20px] px-5 py-3 absolute -top-9 shadow-lg">
                        <Typography
                            variant="h5"
                            className="uppercase text-white text-center line-clamp-1"
                        >
                            PROFILE
                        </Typography>
                    </div>
                    <Avatar
                        src={
                            writer.avatar_url || "/public/images/no-images.png"
                        }
                        className="w-[180px] h-[180px]"
                    />
                    <Typography
                        variant="lead"
                        className="font-normal text-center mt-7"
                    >
                        {writer.name || "No Name provided"}
                    </Typography>
                    <Typography
                        variant="small"
                        className="font-normal text-center text-gray-600"
                    >
                        {writer.email || "No email provided"}
                    </Typography>
                    <Typography
                        variant="small"
                        className="font-normal mt-4 text-center"
                    >
                        {writer.phone || "No description available"}
                    </Typography>
                    <Typography
                        variant="small"
                        className="font-normal mt-1 text-center"
                    >
                        {writer.address || "No description available"}
                    </Typography>
                    <Typography
                        variant="paragraph"
                        className="font-normal mt-1 text-center"
                    >
                        {writer.description || "No description available"}
                    </Typography>
                </div>

                {/* Blog Section */}
                <div className="mx-auto py-12">
                    <Typography variant="small" className="font-normal">
                        Browse and Read the Latest Stuff
                    </Typography>
                    <Typography variant="h3" className="font-bold">
                        Category Blogs
                    </Typography>

                    {/* Blog List */}
                    <div className="flex gap-12 flex-wrap justify-center mt-6">
                        {writer.blogs.length > 0 ? (
                            writer.blogs.map((blog) => (
                                <Card key={blog.id} className="mt-6 w-60">
                                    <CardHeader
                                        color="blue-gray"
                                        className="relative h-44"
                                    >
                                        <img
                                            src={
                                                blog.thumbnail_url ||
                                                "/public/no-images.png"
                                            }
                                            alt={blog.title}
                                            className="object-cover object-center"
                                        />
                                    </CardHeader>
                                    <CardBody>
                                        <div className="w-max my-2">
                                            <Chip
                                                variant="ghost"
                                                size="sm"
                                                value={blog.category?.name}
                                                color="gray"
                                            />
                                        </div>
                                        <Typography
                                            variant="h5"
                                            color="blue-gray"
                                            className="mb-2 truncate"
                                        >
                                            {blog.title || "Untitled"}
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            color="gray"
                                        >
                                            by{" "}
                                            {blog.writer?.name || "Anonymous"}{" "}
                                            at{" "}
                                            {new Date(
                                                blog.created_at
                                            ).toLocaleDateString("en-GB")}
                                        </Typography>
                                    </CardBody>
                                    <CardFooter className="pt-0">
                                        <Link
                                            href={route("blogs.show", blog.id)}
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
                            ))
                        ) : (
                            <Typography className="text-center p-8">
                                No blogs yet!
                            </Typography>
                        )}
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
