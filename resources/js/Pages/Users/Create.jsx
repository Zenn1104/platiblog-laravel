import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
    Popover,
    PopoverHandler,
    PopoverContent,
    Select,
    Option,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import {
    ChevronRightIcon,
    ChevronLeftIcon,
    CalendarDateRangeIcon,
} from "@heroicons/react/24/outline";
import { Head, useForm } from "@inertiajs/react";

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        place_of_birth: "",
        date_of_birth: "",
        address: "",
        avatar: null, // Set avatar to null initially to handle file uploads
        role: "reader",
        gender: "etc",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("users.store"));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Users Create" />
            <div className="container w-full max-w-lg p-6 mx-auto space-y-6">
                <Card shadow={false} className="w-full h-full p-6 mx-auto">
                    <Typography variant="h4" color="blue-gray">
                        Create User
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                        Nice to meet you! Enter user details to creating a new
                        user.
                    </Typography>
                    <form
                        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
                        onSubmit={submit}
                    >
                        <div className="mb-1 flex flex-col gap-6">
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="-mb-3"
                            >
                                Name
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="Jhon Doe"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className:
                                        "before:content-none after:content-none",
                                }}
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="-mb-3"
                            >
                                Email
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="jhon@mail.com"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className:
                                        "before:content-none after:content-none",
                                }}
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <div className="my-4 flex items-center gap-2">
                                <div>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="mb-2 font-medium"
                                    >
                                        Place Of Birth
                                    </Typography>
                                    <Input
                                        placeholder="Sengkang"
                                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                        labelProps={{
                                            className:
                                                "before:content-none after:content-none",
                                        }}
                                        value={data.place_of_birth}
                                        onChange={(e) =>
                                            setData(
                                                "place_of_birth",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="mb-2 font-medium"
                                    >
                                        Date Of Birth
                                    </Typography>
                                    <Popover placement="bottom">
                                        <PopoverHandler>
                                            <Input
                                                label="Select a Date"
                                                value={
                                                    data.date_of_birth
                                                        ? format(
                                                              data.date_of_birth,
                                                              "dd/MM/yyyy"
                                                          ) // Format date to readable string
                                                        : ""
                                                }
                                                readOnly // Make input read-only to ensure user selects via DayPicker
                                                containerProps={{
                                                    className: "min-w-[82px]",
                                                }}
                                                icon={<CalendarDateRangeIcon />}
                                            />
                                        </PopoverHandler>
                                        <PopoverContent>
                                            <DayPicker
                                                mode="single"
                                                selected={data.date_of_birth}
                                                onSelect={
                                                    (date) =>
                                                        setData(
                                                            "date_of_birth",
                                                            date
                                                        ) // Directly pass the Date object from DayPicker
                                                }
                                                showOutsideDays
                                                className="border-0"
                                                classNames={{
                                                    caption:
                                                        "flex justify-center py-2 mb-4 relative items-center",
                                                    caption_label:
                                                        "text-sm font-medium text-gray-900",
                                                    nav: "flex items-center",
                                                    nav_button:
                                                        "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                                                    nav_button_previous:
                                                        "absolute left-1.5",
                                                    nav_button_next:
                                                        "absolute right-1.5",
                                                    table: "w-full border-collapse",
                                                    head_row:
                                                        "flex font-medium text-gray-900",
                                                    head_cell:
                                                        "m-0.5 w-9 font-normal text-sm",
                                                    row: "flex w-full mt-2",
                                                    cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                                    day: "h-9 w-9 p-0 font-normal",
                                                    day_range_end:
                                                        "day-range-end",
                                                    day_selected:
                                                        "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                                                    day_today:
                                                        "rounded-md bg-gray-200 text-gray-900",
                                                    day_outside:
                                                        "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                                                    day_disabled:
                                                        "text-gray-500 opacity-50",
                                                    day_hidden: "invisible",
                                                }}
                                                components={{
                                                    IconLeft: ({
                                                        ...props
                                                    }) => (
                                                        <ChevronLeftIcon
                                                            {...props}
                                                            className="h-4 w-4 stroke-2"
                                                        />
                                                    ),
                                                    IconRight: ({
                                                        ...props
                                                    }) => (
                                                        <ChevronRightIcon
                                                            {...props}
                                                            className="h-4 w-4 stroke-2"
                                                        />
                                                    ),
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="-mb-3"
                            >
                                Password
                            </Typography>
                            <Input
                                type="password"
                                size="lg"
                                placeholder="********"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className:
                                        "before:content-none after:content-none",
                                }}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="-mb-3"
                            >
                                Confirm Password
                            </Typography>
                            <Input
                                type="password"
                                size="lg"
                                placeholder="********"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className:
                                        "before:content-none after:content-none",
                                }}
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                            />
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="-mb-3"
                            >
                                Address
                            </Typography>
                            <Input
                                type="test"
                                size="lg"
                                placeholder="Jl. Belum Ada No. 34"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className:
                                        "before:content-none after:content-none",
                                }}
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                            />
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="-mb-3"
                            >
                                Role
                            </Typography>
                            <Select
                                label="Select Role"
                                value={data.role}
                                onChange={(value) => setData("role", value)}
                            >
                                <Option value="admin">Admin</Option>
                                <Option value="writer">Writer</Option>
                                <Option value="reader">Reader</Option>
                            </Select>
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="-mb-3"
                            >
                                Gender
                            </Typography>
                            <Select
                                label="Select Gender"
                                value={data.gender}
                                onChange={(value) => setData("gender", value)}
                            >
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                                <Option value="etc">Etc</Option>
                            </Select>
                            <Typography
                                variant="h6"
                                color="blue-gray"
                                className="-mb-3"
                            >
                                Avatar
                            </Typography>
                            <Input
                                type="file"
                                variant="static"
                                size="lg"
                                placeholder="No File Choice"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className:
                                        "before:content-none after:content-none",
                                }}
                                containerProps={{
                                    className: "min-w-[82px]",
                                }}
                                onChange={(e) =>
                                    setData("avatar", e.target.files[0])
                                }
                            />
                        </div>
                        <Button
                            className="mt-12"
                            fullWidth
                            loading={processing}
                            type="submit"
                        >
                            save
                        </Button>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
