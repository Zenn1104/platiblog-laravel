import AuthenticatedLayout  from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import {
    Card,
    Input,
    Button,
    Typography,
  } from "@material-tailwind/react";


export default function Edit({ auth, category }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: category.name,
        slug: category.slug,
        description: category.description,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('categories.update', { category: category.id }), {
            onError: (error) => {
                console.error({error});
            },
            onSuccess: reset('name', 'slug', 'description'),
        });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
           <Head title="Category"/>
            <div className="container w-full max-w-lg p-6 mx-auto space-y-6">
            <Card className="w-full h-full p-6 mx-auto" shadow={false}>
                <Typography variant="h4" color="blue-gray">
                    Edit Category
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    Nice to meet you! Enter the data about the category.
                </Typography>
                <form onSubmit={submit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" method="PUT">
                    <div className="mb-1 flex flex-col gap-6">
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Name
                    </Typography>
                    <Input
                        size="lg"
                        placeholder="mental health"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                        className: "before:content-none after:content-none",
                        }}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Slug
                    </Typography>
                    <Input
                        size="lg"
                        placeholder="mental-health"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                        className: "before:content-none after:content-none",
                        }}
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                    />
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Description
                    </Typography>
                    <Input
                        size="lg"
                        placeholder="for something category"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                        className: "before:content-none after:content-none",
                        }}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    </div>
                    <Button loading={processing} type="submit" className="mt-6" fullWidth>
                    Save
                    </Button>
                </form>
            </Card>
            </div>
        </AuthenticatedLayout>
    )
}
