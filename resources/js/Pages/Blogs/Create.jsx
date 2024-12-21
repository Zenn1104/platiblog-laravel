import { WSSIYGEditor } from "@/Components/WSSIYGEditor";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    Card,
    Input,
    Button,
    Typography,
    Select,
    Option,
} from "@material-tailwind/react";
import { useEffect } from "react";

export default function Create({ auth, categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        category: "",
        thumbnail: null,
        content: "",
    });

    useEffect(() => {
        return () => {
            reset("title", "category", "thumbnail", "content");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        // Create FormData object
        const formData = new FormData();

        // Append each form data field
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        // Post form data to the backend
        post(route("blogs.store"), {
            data: formData,
            forceFormData: true, // Forces sending FormData in the correct format
            onStart: () => {
                console.log("Form submission started");
            },
            onFinish: () => {
                console.log("Form submission finished");
            },
            onSuccess: () => {
                console.log("Form submission successful");
            },
            onError: (errors) => {
                console.error("Form submission failed", errors.message);
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Blog" />
            <div className="container w-full max-w-4xl p-6 mx-auto space-y-6">
                <Card className="w-full h-full p-6 mx-auto" shadow={false}>
                    <Typography variant="h4" color="blue-gray">
                        Create Blog
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                        Nice to meet you! Enter the data about the blog.
                    </Typography>
                    <form onSubmit={submit} className="mt-8 mb-2 w-full">
                        <div className="mb-1 flex flex-col gap-6">
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="-mb-3"
                            >
                                Title
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="mental health"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className:
                                        "before:content-none after:content-none",
                                }}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                            />
                            {errors.title && (
                                <Typography color="red">
                                    {errors.title}
                                </Typography>
                            )}

                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="-mb-3"
                            >
                                Category
                            </Typography>
                            <Select
                                label="Select Category"
                                onChange={(value) => setData("category", value)}
                            >
                                {categories.map((category, index) => (
                                    <Option
                                        key={index}
                                        value={category.id.toString()}
                                    >
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                            {errors.category && (
                                <Typography color="red">
                                    {errors.category}
                                </Typography>
                            )}

                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="-mb-3"
                            >
                                Thumbnail Blog
                            </Typography>
                            <Input
                                type="file"
                                size="lg"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className:
                                        "before:content-none after:content-none",
                                }}
                                containerProps={{
                                    className: "min-w-[82px]",
                                }}
                                onChange={(e) =>
                                    setData("thumbnail", e.target.files[0])
                                }
                            />
                            {errors.thumbnail && (
                                <Typography color="red">
                                    {errors.thumbnail}
                                </Typography>
                            )}
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="-mb-3"
                            >
                                Blog Content
                            </Typography>

                            <WSSIYGEditor
                                value={data?.content}
                                onChange={(newValue) =>
                                    setData("content", newValue)
                                }
                                placeHolder="Type something..."
                                name="create"
                            />

                            {errors.content && (
                                <Typography color="red">
                                    {errors.content}
                                </Typography>
                            )}
                        </div>
                        <Button
                            loading={processing}
                            type="submit"
                            className="mt-6"
                            fullWidth
                        >
                            Save
                        </Button>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
