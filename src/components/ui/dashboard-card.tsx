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
        default: "",
        primary: "border-primary/20 bg-primary/5",
        success: "border-green-500/20 bg-green-500/5",
        warning: "border-yellow-500/20 bg-yellow-500/5",
        danger: "border-red-500/20 bg-red-500/5",
    };

    const iconStyles = {
        default: "text-gray-500",
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
            className={cn("hover:shadow-md transition-shadow", variantStyles[variant], className)}
            elevation="sm"
        >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">{title}</CardTitle>
                {icon && (
                    <div className={cn("p-2 rounded-full bg-gray-100/80 dark:bg-gray-800/80", iconStyles[variant])}>
                        {icon}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-1">
                    <div className="text-2xl font-semibold">{value}</div>

                    {(trend || description) && (
                        <div className="flex items-center text-sm">
                            {trend && (
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium mr-2",
                                        trend.isPositive ? trendStyles.positive : trendStyles.negative
                                    )}
                                >
                                    {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                                </span>
                            )}
                            {description && (
                                <span className="text-muted-foreground text-xs">{description}</span>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
