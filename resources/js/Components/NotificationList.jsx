import React, { useEffect, useState } from "react";
import { ClockIcon } from "@heroicons/react/24/solid";
import {
    Avatar,
    MenuItem,
    MenuList,
    Typography,
} from "@material-tailwind/react";

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            fetch(route("notifications"), {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `Network response was not ok, status: ${response.status}`
                        );
                    }
                    return response.json();
                })
                .then((result) => {
                    if (
                        !result.notifications ||
                        !Array.isArray(result.notifications)
                    ) {
                        throw new Error("Invalid response structure.");
                    }

                    // Parse `data` for each notification
                    const parsedNotifications = result.notifications.map(
                        (notification) => {
                            return {
                                ...notification,
                                data: JSON.parse(notification.data), // Convert `data` to object
                            };
                        }
                    );

                    setNotifications(parsedNotifications);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error.message);
                });
        };

        fetchData();
    }, []);

    return (
        <MenuList className="flex flex-col gap-2 p-4 rounded">
            <div>
                <Typography variant="h5" className="font-bold">
                    Notifications
                </Typography>
            </div>
            <hr />
            <div className="max-h-60 overflow-y-scroll gap-x-2">
                {notifications.length > 0 || notifications !== undefined ? (
                    notifications.map((notification, index) => (
                        <MenuItem
                            key={index}
                            className="flex items-center gap-4 py-2 pl-2 pr-8 rounded"
                        >
                            <Avatar
                                variant="circular"
                                alt="thumbnail"
                                src={
                                    notification.data.blog?.thumbnail_url ||
                                    notification.data.writer?.avatar_url ||
                                    "http://localhost:8000/storage/no-image.png"
                                }
                            />
                            <Link
                                href={route(
                                    "blogs.show",
                                    notification.data.blog_id
                                )}
                            >
                                <div className="flex flex-col gap-1">
                                    <Typography
                                        variant="paragraph"
                                        color="gray"
                                        className="font-semibold max-w-[173px] truncate"
                                    >
                                        {notification.data.message ||
                                            "No message available"}
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        className="flex items-center gap-1 font-medium"
                                        color="blue-gray"
                                    >
                                        <ClockIcon className="h-5 w-5" />
                                        {notification.created_at
                                            ? new Date(
                                                  notification.created_at
                                              ).toLocaleString()
                                            : "Unknown time"}
                                    </Typography>
                                </div>
                            </Link>
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem>No Notification Available.</MenuItem>
                )}
            </div>
        </MenuList>
    );
};

export default NotificationList;
