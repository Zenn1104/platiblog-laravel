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
import { useEffect, useState } from "react";

export default function Edit({ auth, categories, blog }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: blog.title,
        category: blog.category_id,
        thumbnail: blog.thumbnail,
        content: blog.content,
        _method: "PUT",
    });
    const [preview, setPreview] = useState(blog.thumbnail_url || ""); // Initial preview for the current thumbnail
    const [editorValue, setEditorValue] = useState(blog.content);

    const handleChange = (value) => {
        setEditorValue(value); // Simpan nilai terbaru di state
        setData("content", value);
    };

    useEffect(() => {
        return () => {
            reset("title", "category", "thumbnail", "content");
        };
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("thumbnail", file);

            // Update preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        // Prepare form data for the file upload
        const formData = new FormData();
        Object.keys(data).forEach((key) => formData.append(key, data[key]));

        post(route("blogs.update", blog.id), {
            data: formData,
            forceFormData: true,
            onSuccess: () => console.log("Form submission successful"),
            onError: (errors) =>
                console.error("Form submission failed", errors),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Blog" />
            <div className="container w-full max-w-4xl p-6 mx-auto space-y-6">
                <Card className="w-full h-full p-6 mx-auto" shadow={false}>
                    <Typography variant="h4" color="blue-gray">
                        Edit Blog
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                        Update the blog details below.
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
                                placeholder="Enter blog title"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={data.title}
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
                                value={data.category.toString()}
                                onChange={(value) => setData("category", value)}
                            >
                                {categories.map((category) => (
                                    <Option
                                        key={category.id}
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
                            {preview && (
                                <div className="mb-4">
                                    <img
                                        src={preview}
                                        alt="Thumbnail Preview"
                                        className="h-32 w-32 object-cover"
                                    />
                                </div>
                            )}
                            <Input
                                type="file"
                                size="lg"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                onChange={handleFileChange}
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
                                value={editorValue}
                                onChange={(newValue) => handleChange(newValue)}
                                placeHolder="Type something..."
                                name="edit"
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
