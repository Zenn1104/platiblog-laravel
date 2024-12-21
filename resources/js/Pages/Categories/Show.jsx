import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, Head } from "@inertiajs/react";
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
    List,
    ListItem,
    ListItemPrefix,
    Chip,
} from "@material-tailwind/react";

export default function Show({ auth, category }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={category.name} />
            <div className="container w-full max-w-6xl p-6 mx-auto space-y-6">
                <Card className="h-full w-full">
                    <List>
                        <ListItem>
                            <div>
                                <Typography variant="h3" color="blue-gray">
                                    #{category.name}
                                </Typography>
                                <Typography
                                    variant="small"
                                    color="gray"
                                    className="font-normal"
                                >
                                    {category.description}
                                </Typography>
                                {category.blogs.length > 0 ? (
                                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                                        {category.blogs.map((blog) => {
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
                                                        floated={false}
                                                    >
                                                        <img
                                                            src={thumbnail_url}
                                                            alt={title}
                                                            className="object-cover object-center"
                                                        />
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Typography
                                                            variant="h5"
                                                            color="blue-gray"
                                                            className="mb-2 truncate"
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
                                                                    blog.writer
                                                                        .id
                                                                )}
                                                                className="hover:underline"
                                                            >
                                                                {
                                                                    blog.writer
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
                                                                Read More...
                                                            </Button>
                                                        </Link>
                                                    </CardFooter>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p>Belum ada blog</p>
                                )}
                            </div>
                        </ListItem>
                    </List>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
