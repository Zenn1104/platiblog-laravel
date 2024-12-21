import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Card,
    Input,
    Button,
    Typography,
    Popover,
    PopoverHandler,
    PopoverContent,
    Select,
    Option,
    Textarea,
    Stepper,
    Step,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import {
    ChevronRightIcon,
    ChevronLeftIcon,
    CalendarDateRangeIcon,
} from "@heroicons/react/24/outline";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    BriefcaseIcon,
    CalendarIcon,
    UserCircleIcon,
} from "@heroicons/react/24/solid";

export default function JoinWriterForm({ auth }) {
    const { data, setData, post, processing } = useForm({
        name: "",
        phone: "",
        place_of_birth: "",
        date_of_birth: "",
        address: "",
        gender: "",
        avatar: null,
        job: "",
        last_education: "",
        description: "",
    });

    // Handle form submission
    const submit = (e) => {
        e.preventDefault();

        // Create FormData object
        const formData = new FormData();

        // Append each form data field
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        // Post form data to the backend
        post(route("writer.form"), {
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
                console.error("Form submission failed", errors);
            },
        });
    };


    // State to track the current step
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        <UserCircleIcon className="h-5 w-5" />,
        <CalendarIcon className="h-5 w-5" />,
        <BriefcaseIcon className="h-5 w-5" />,
    ];

    // Go to the next activeStep
    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        }
    };

    // Go to the previous activeStep
    const handlePrev = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Form Join Writer" />
            <div className="container w-full max-w-4xl p-6 pt-12 mx-auto space-y-6">
                <Stepper activeStep={activeStep} className="mb-8 w-1/2 mx-auto">
                    {steps.map((label, index) => (
                        <Step
                            key={index}
                            onClick={() => setActiveStep(index)}
                            className="cursor-pointer"
                        >
                            <Typography
                                variant="small"
                                className="font-semibold"
                            >
                                {label}
                            </Typography>
                        </Step>
                    ))}
                </Stepper>
                <Card shadow={false} className="w-full h-full p-6 mx-auto">
                    <Typography variant="h4" color="blue-gray">
                        Form Join Writer
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                        Nice to meet you! Enter your details to join writer.
                    </Typography>
                    <form className="mt-8 mb-2 w-full" onSubmit={submit}>
                        <div className="mb-1 flex flex-col gap-6">
                            {activeStep === 0 && (
                                <>
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
                                        Phone
                                    </Typography>
                                    <Input
                                        size="lg"
                                        placeholder="+628887777999"
                                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                        labelProps={{
                                            className:
                                                "before:content-none after:content-none",
                                        }}
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                    />
                                </>
                            )}
                            {activeStep === 1 && (
                                <>
                                    <div className="my-4 flex items-center gap-2 w-full">
                                        <div className="w-full flex-1">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="mb-2 font-medium"
                                            >
                                                Place Of Birth
                                            </Typography>
                                            <Input
                                                placeholder="Sengkang"
                                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900 w-full"
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
                                        <div className="w-full flex-1">
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
                                                            className:
                                                                "min-w-[82px] w-full",
                                                        }}
                                                        icon={
                                                            <CalendarDateRangeIcon />
                                                        }
                                                    />
                                                </PopoverHandler>
                                                <PopoverContent>
                                                    <DayPicker
                                                        mode="single"
                                                        selected={
                                                            data.date_of_birth
                                                        }
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
                                                            day_hidden:
                                                                "invisible",
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
                                </>
                            )}
                            {activeStep === 2 && (
                                <>
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
                                        onChange={(value) =>
                                            setData("gender", value)
                                        }
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
                                    <Typography
                                        variant="h6"
                                        color="blue-gray"
                                        className="-mb-3"
                                    >
                                        Job
                                    </Typography>
                                    <Input
                                        size="lg"
                                        placeholder="Web Designer"
                                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                        labelProps={{
                                            className:
                                                "before:content-none after:content-none",
                                        }}
                                        value={data.job}
                                        onChange={(e) =>
                                            setData("job", e.target.value)
                                        }
                                    />
                                    <Typography
                                        variant="h6"
                                        color="blue-gray"
                                        className="-mb-3"
                                    >
                                        Last Education
                                    </Typography>
                                    <Input
                                        size="lg"
                                        placeholder="University Of Indonesia Faculcity of Computer Science"
                                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                        labelProps={{
                                            className:
                                                "before:content-none after:content-none",
                                        }}
                                        value={data.last_education}
                                        onChange={(e) =>
                                            setData(
                                                "last_education",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Typography
                                        variant="h6"
                                        color="blue-gray"
                                        className="-mb-3"
                                    >
                                        Description
                                    </Typography>
                                    <Textarea
                                        size="lg"
                                        placeholder="About you"
                                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                        labelProps={{
                                            className:
                                                "before:content-none after:content-none",
                                        }}
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                    />
                                </>
                            )}
                        </div>
                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6">
                            {activeStep > 0 ||
                                (!activeStep === steps.length - 1 && (
                                    <Button onClick={handlePrev} type="button">
                                        Previous
                                    </Button>
                                ))}
                            {activeStep < steps.length - 1 && (
                                <Button onClick={handleNext} type="button">
                                    Next
                                </Button>
                            )}
                            {activeStep === steps.length - 1 && (
                                <Button
                                    type="submit"
                                    fullWidth
                                    loading={processing}
                                >
                                    Submit
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
