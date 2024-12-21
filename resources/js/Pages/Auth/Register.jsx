import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        place_of_birth: '',
        date_of_birth: '',
        address: '',
        avatar: null, // Set avatar to null initially to handle file uploads
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        // Create a FormData object to handle file upload along with form data
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('place_of_birth', data.place_of_birth);
        formData.append('date_of_birth', data.date_of_birth);
        formData.append('address', data.address);
        formData.append('avatar', data.avatar); // Append the selected file
        formData.append('password', data.password);
        formData.append('password_confirmation', data.password_confirmation);

        post(route('register'), {
            data: formData,
            forceFormData: true, // This forces Inertia to send FormData correctly
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit} encType="multipart/form-data"> {/* Use multipart/form-data */}
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="place_of_birth" value="Place of Birth" />

                    <TextInput
                        id="place_of_birth"
                        type="text"
                        name="place_of_birth"
                        value={data.place_of_birth}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('place_of_birth', e.target.value)}
                        required
                    />

                    <InputError message={errors.place_of_birth} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="date_of_birth" value="Date of Birth" />

                    <TextInput
                        id="date_of_birth"
                        type="date"
                        name="date_of_birth"
                        value={data.date_of_birth}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('date_of_birth', e.target.value)}
                        required
                    />

                    <InputError message={errors.date_of_birth} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="address" value="Address" />

                    <TextInput
                        id="address"
                        type="text"
                        name="address"
                        value={data.address}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('address', e.target.value)}
                        required
                    />

                    <InputError message={errors.address} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="avatar" value="Avatar" />

                    <TextInput
                        id="avatar"
                        type="file"
                        name="avatar"
                        className="mt-1 block w-full"
                        onChange={(e) => setData('avatar', e.target.files[0])} // Capture the file
                        required
                    />

                    <InputError message={errors.avatar} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
                <div className="flex justify-center items-center mt-2 gap-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
                        Already have an Account?
                    </p>
                    <Link
                        href={route('login')}
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                        Login
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
