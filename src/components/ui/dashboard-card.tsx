"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    description?: string;
    className?: string;
    variant?: "default" | "primary" | "success" | "warning" | "danger";
}

export function DashboardCard({
    title,
    value,
    icon,
    trend,
    description,
    className,
    variant = "default",
}: DashboardCardProps) {
    // Definindo cores com base na variante
    const variantStyles = {
        default: "border-gray-200 dark:border-gray-700",
        primary: "border-primary/20 bg-primary/5",
        success: "border-green-500/20 bg-green-500/5",
        warning: "border-yellow-500/20 bg-yellow-500/5",
        danger: "border-red-500/20 bg-red-500/5",
    };

    const iconStyles = {
        default: "text-gray-500 bg-gray-100 dark:bg-gray-800",
        primary: "text-primary bg-primary/10",
        success: "text-green-500 bg-green-500/10",
        warning: "text-yellow-500 bg-yellow-500/10",
        danger: "text-red-500 bg-red-500/10",
    };

    const valueStyles = {
        default: "text-gray-900 dark:text-gray-100",
        primary: "text-primary",
        success: "text-green-500",
        warning: "text-yellow-500",
        danger: "text-red-500",
    };

    const trendStyles = {
        positive: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
        negative: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400",
    };

    return (
        <Card
            className={cn(
                "overflow-hidden border shadow-sm hover:shadow-md transition-shadow",
                variantStyles[variant],
                className
            )}
        >
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-base font-medium">{title}</CardTitle>
                {icon && (
                    <div className={cn(
                        "p-2 rounded-full",
                        iconStyles[variant]
                    )}>
                        {icon}
                    </div>
                )}
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                    <div className={cn("text-3xl font-bold", valueStyles[variant])}>{value}</div>

                    {(trend || description) && (
                        <div className="flex items-center text-sm mt-1">
                            {trend && (
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mr-2",
                                        trend.isPositive ? trendStyles.positive : trendStyles.negative
                                    )}
                                >
                                    {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                                </span>
                            )}
                            {description && (
                                <span className="text-muted-foreground text-sm">{description}</span>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
