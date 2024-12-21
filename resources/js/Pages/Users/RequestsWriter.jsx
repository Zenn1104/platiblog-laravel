import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { router } from "@inertiajs/react";
import {
    Avatar,
    Button,
    Chip,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    IconButton,
    Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";

const TABLE_HEAD = [
    { label: "Name" },
    { label: "Job" },
    { label: "Status" },
    { label: "Description" },
    { label: "Actions" },
];

const STATUS = [
    {
        status: "pending",
        color: "blue-gray",
    },
    {
        status: "approve",
        color: "teal",
    },
    {
        status: "rejected",
        color: "red",
    },
];

export function RequestsWriter({ open, handleOpen = () => {} }) {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        prev_page_url: null,
        next_page_url: null,
    });
    const [selectedUser, setSelectedUser] = useState(null); // Menyimpan user yang dipilih

    // Fungsi untuk fetch data dari API dengan pagination
    const fetchData = (page = 1) => {
        fetch(route("writer.request", { page })) // menambahkan parameter page
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((result) => {
                setData(result.data);
                setPagination({
                    current_page: result.data.current_page,
                    last_page: result.data.last_page,
                    prev_page_url: result.data.prev_page_url,
                    next_page_url: result.data.next_page_url,
                });
            })
            .catch((error) => {
                console.error("There was an error fetching the data:", error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Fungsi untuk mengganti halaman tanpa pindah URL
    const handlePageChange = (url) => {
        const page = new URL(url).searchParams.get("page");
        fetchData(page);
    };

    const handleApprove = (id) => {
        router.post(route("writer.approve", { id: id }));
    };

    const handleReject = (id) => {
        router.post(route("writer.reject", { id: id }));
    };

    const handleUserClick = (user) => {
        setSelectedUser(user); // Set the selected user to display details
    };

    const handleBack = () => {
        setSelectedUser(null); // Reset to show the list again
    };

    return (
        <>
            <Dialog
                open={open}
                handler={handleOpen}
                className="opacity-10 overflow-scroll scrollbar-hide"
                size="xl"
            >
                <div className="flex items-center justify-between">
                    <DialogHeader className="flex flex-col items-start">
                        <Typography
                            variant="h4"
                            className="mb-1"
                            color="blue-gray"
                        >
                            {selectedUser
                                ? "Detail User Request"
                                : "Request Writers"}
                        </Typography>
                        <Typography
                            variant="small"
                            className="font-normal"
                            color="gray"
                        >
                            {selectedUser
                                ? `${selectedUser.name}'s Detail Request.`
                                : "The list of all request Writer."}
                        </Typography>
                    </DialogHeader>
                    <IconButton
                        variant="text"
                        onClick={handleOpen}
                        className="mr-3 mb-5"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </IconButton>
                </div>
                <DialogBody className="h-[25rem] overflow-scroll scrollbar-hide">
                    {/* Conditional rendering based on whether a user is selected */}
                    {!selectedUser ? (
                        <table className="mt-4 w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th
                                            key={head.label}
                                            className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 cursor-pointer"
                                        >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                {head.label}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data?.data?.length > 0 ? (
                                    data.data?.map((request, index) => {
                                        const {
                                            avatar_url,
                                            name,
                                            email,
                                            job,
                                            writer_status,
                                            description,
                                        } = request;
                                        const isLast =
                                            index === data.length - 1;
                                        const classes = isLast
                                            ? "p-4"
                                            : "p-3 border-b border-blue-gray-50";

                                        return (
                                            <tr
                                                key={index}
                                                onClick={() =>
                                                    handleUserClick(request)
                                                } // Klik nama user
                                                className="cursor-pointer"
                                            >
                                                <td className={classes}>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar
                                                            src={
                                                                avatar_url ||
                                                                "http://localhost:8000/no-image.png"
                                                            }
                                                            alt={name}
                                                            size="sm"
                                                        />
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {name}
                                                            </Typography>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal opacity-70"
                                                            >
                                                                {email}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {job}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Chip
                                                        variant="ghost"
                                                        size="sm"
                                                        value={writer_status}
                                                        color={
                                                            STATUS.find(
                                                                (s) =>
                                                                    s.status ===
                                                                    writer_status
                                                            )?.color || "gray"
                                                        }
                                                    />
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="truncate font-normal overflow-hidden w-80"
                                                    >
                                                        {description}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <IconButton
                                                        color="teal"
                                                        variant="gradient"
                                                        size="sm"
                                                        className="mr-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Mencegah mengklik detail user
                                                            handleApprove(
                                                                request.id
                                                            );
                                                        }}
                                                    >
                                                        <CheckIcon className="w-5 h-5" />
                                                    </IconButton>
                                                    <IconButton
                                                        color="red"
                                                        variant="gradient"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Mencegah mengklik detail user
                                                            handleReject(
                                                                request.id
                                                            );
                                                        }}
                                                    >
                                                        <XMarkIcon className="w-5 h-5" />
                                                    </IconButton>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-center p-8"
                                        >
                                            No Request yet!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <div className="mx-auto flex flex-col items-center">
                            <div className="flex items-start gap-20 -ml-16 mt-8">
                                <Avatar
                                    src={
                                        selectedUser.avatar_url ||
                                        "http://localhost:8000/no-image.png"
                                    }
                                    alt={selectedUser.name}
                                    size="xxl"
                                    variant="square"
                                />
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-4">
                                        <Typography variant="h6">
                                            Email:
                                        </Typography>{" "}
                                        <Typography variant="paragraph">
                                            {selectedUser.email}
                                        </Typography>
                                    </div>
                                    <div className="flex gap-4">
                                        <Typography variant="h6">
                                            Phone Number:
                                        </Typography>{" "}
                                        <Typography variant="paragraph">
                                            {selectedUser.phone}
                                        </Typography>
                                    </div>
                                    <div className="flex gap-4">
                                        <Typography variant="h6">
                                            Birthday:
                                        </Typography>{" "}
                                        <Typography variant="paragraph">
                                            {selectedUser.birth}
                                        </Typography>
                                    </div>
                                    <div className="flex gap-4">
                                        <Typography variant="h6">
                                            Job:
                                        </Typography>{" "}
                                        <Typography variant="paragraph">
                                            {selectedUser.job}
                                        </Typography>
                                    </div>
                                    <div className="flex gap-4">
                                        <Typography variant="h6">
                                            Status:
                                        </Typography>{" "}
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={selectedUser.writer_status}
                                            color={
                                                STATUS.find(
                                                    (s) =>
                                                        s.status ===
                                                        selectedUser.writer_status
                                                )?.color || "gray"
                                            }
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <Typography variant="h6">
                                            Address:
                                        </Typography>{" "}
                                        <Typography variant="paragraph">
                                            {selectedUser.address}
                                        </Typography>
                                    </div>
                                    <div className="flex gap-4">
                                        <Typography variant="h6">
                                            Last Education:
                                        </Typography>{" "}
                                        <Typography variant="paragraph">
                                            {selectedUser.last_education}
                                        </Typography>
                                    </div>
                                    <div className="flex flex-col">
                                        <Typography variant="h6">
                                            Description:
                                        </Typography>{" "}
                                        <Typography
                                            variant="paragraph"
                                            className="-mr-8"
                                        >
                                            {selectedUser.description}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogBody>
                <DialogFooter
                    className={`flex items-center justify-between border-t border-blue-gray-50 p-4 ${
                        selectedUser ? "gap-8" : ""
                    }`}
                >
                    {!selectedUser ? (
                        <>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >
                                Page {pagination.current_page} of{" "}
                                {pagination.last_page}
                            </Typography>
                            <div className="flex gap-2">
                                {pagination.prev_page_url && (
                                    <Button
                                        variant="outlined"
                                        size="sm"
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.prev_page_url
                                            )
                                        }
                                    >
                                        Previous
                                    </Button>
                                )}
                                {pagination.next_page_url && (
                                    <Button
                                        variant="outlined"
                                        size="sm"
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.next_page_url
                                            )
                                        }
                                    >
                                        Next
                                    </Button>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mt-4">
                                <Button
                                    variant="outlined"
                                    color="blue-gray"
                                    onClick={handleBack}
                                    size="sm"
                                >
                                    Back to List
                                </Button>
                            </div>
                            <div className="mt-4">
                                <Button
                                    variant="outlined"
                                    color="teal"
                                    onClick={() => {
                                        handleApprove(selectedUser.id);
                                    }}
                                    size="sm"
                                    className="mr-4"
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="red"
                                    onClick={() => {
                                        handleReject(selectedUser.id);
                                    }}
                                    size="sm"
                                >
                                    Reject
                                </Button>
                            </div>
                        </>
                    )}
                </DialogFooter>
            </Dialog>
        </>
    );
}
