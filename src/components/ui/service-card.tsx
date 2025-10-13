import Image from "next/image";
import Link from "next/link";
import { Clock, Edit } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    category?: string;
    imageUrl?: string;
}

export function ServiceCard({
    id,
    name,
    description,
    price,
    duration,
    category,
    imageUrl,
}: ServiceCardProps) {
    // Função para formatar duração
    const formatDuration = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return remainingMinutes > 0
                ? `${hours}h ${remainingMinutes}min`
                : `${hours}h`;
        }
    };

    return (
        <Card className="h-full overflow-hidden flex flex-col transition-all hover:shadow-md">
            <div className="aspect-video w-full relative overflow-hidden">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                )}
            </div>

            <CardContent className="flex-grow flex flex-col gap-2 pt-4">
                <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>

                {description && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                        {description}
                    </p>
                )}

                <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold text-primary">
                        R$ {price.toFixed(2)}
                    </span>

                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock size={16} />
                        <span className="text-sm">{formatDuration(duration)}</span>
                    </div>
                </div>

                {category && (
                    <div className="mt-2">
                        <Badge variant="secondary" className="font-normal">
                            {category}
                        </Badge>
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-2 pb-4">
                <Button
                    variant="outline"
                    className="w-full"
                    asChild
                >
                    <Link href={`/service/${id}/editService`}>
                        <Edit size={16} />
                        <span>Editar Serviço</span>
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
