import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    UsersIcon,
    TagIcon,
} from "@heroicons/react/24/solid";

const StatisticsWidget = ({ statistics, role }) => {
    const commonStats = [
        {
            title: "Approved Blogs",
            count: statistics.approvedBlogs || 0,
            percentage: statistics.approvedPercentage || 0,
            icon: <CheckCircleIcon className="h-12 w-12 text-green-500" />,
            color: "green",
        },
        {
            title: "Rejected Blogs",
            count: statistics.rejectedBlogs || 0,
            percentage: statistics.rejectedPercentage || 0,
            icon: <XCircleIcon className="h-12 w-12 text-red-500" />,
            color: "red",
        },
        {
            title: "Pending Blogs",
            count: statistics.pendingBlogs || 0,
            percentage: statistics.pendingPercentage || 0,
            icon: <ClockIcon className="h-12 w-12 text-yellow-500" />,
            color: "yellow",
        },
    ];

    const adminStats = [
        {
            title: "Total Blogs",
            count: statistics.totalBlogs || 0,
            percentage: statistics.totalBlogsPercentage || 0, // Pertumbuhan total blog
            icon: <CheckCircleIcon className="h-12 w-12 text-blue-500" />,
            color: "blue",
        },
        {
            title: "Total Users",
            count: statistics.totalUsers || 0,
            percentage: statistics.totalUsersPercentage || 0, // Pertumbuhan total pengguna
            icon: <UsersIcon className="h-12 w-12 text-purple-500" />,
            color: "purple",
        },
        {
            title: "Writer Requests",
            count: statistics.totalWriterRequest || 0,
            percentage: statistics.totalWriterRequestPercentage || 0, // Pertumbuhan permintaan penulis
            icon: <TagIcon className="h-12 w-12 text-orange-500" />,
            color: "orange",
        },
    ];

    const statsToShow = role === "admin" ? adminStats : commonStats;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statsToShow.map((stat, index) => (
                <Card
                    className="flex items-center justify-between p-4 border rounded-lg shadow-sm max-w-sm mx-auto mt-10 w-70 gap-x-8"
                    key={index}
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <div>{stat.icon}</div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {stat.title}
                                </h2>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stat.count}
                                </p>
                            </div>
                        </div>
                        <hr />
                        {/* Display percentage */}
                        <p className="text-xs text-lime-500">
                            + {(stat.percentage || 0).toFixed(2)}%{" "}
                            <span className="text-gray-500">
                                compared to last month
                            </span>
                        </p>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default StatisticsWidget;
