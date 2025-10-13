"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Loader2, ArrowLeft, Clock } from "lucide-react";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
    FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Usando Input temporariamente no lugar de Textarea
import { Card } from "@/components/ui/card";

const schema = z.object({
    name: z.string().min(1, "Nome do serviço é obrigatório"),
    description: z.string().optional(),
    price: z.string().min(1, "Preço é obrigatório"),
    duration: z.string().min(1, "Duração é obrigatória"),
    category: z.string().optional(),
    image: z.any().optional(),
});

type ServiceFormData = z.infer<typeof schema>;

export default function AddServicePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<ServiceFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            description: "",
            price: "",
            duration: "60", // 60 minutos por padrão
            category: "",
        },
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            form.setValue("image", file);
        }
    };

    const onSubmit = async (data: ServiceFormData) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== "") {
                    formData.append(key, value);
                }
            });

            const response = await fetch("/api/service", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Erro ao cadastrar serviço");

            router.push("/service/catalog");
        } catch (error) {
            console.error("Erro ao cadastrar serviço:", error);
            alert("Erro ao cadastrar serviço. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-6 px-4 max-w-3xl">
            <Card className="p-6">
                <div className="flex items-center mb-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="mr-2"
                    >
                        <ArrowLeft size={20} />
                        <span className="sr-only">Voltar</span>
                    </Button>
                    <h1 className="text-2xl font-bold">Adicionar Serviço</h1>
                </div>

                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <label
                            htmlFor="image-upload"
                            className="block w-48 h-48 rounded-lg overflow-hidden border-2 border-dashed border-muted cursor-pointer"
                        >
                            {previewUrl ? (
                                <Image
                                    src={previewUrl}
                                    alt="Imagem do serviço"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                                    <Camera size={32} className="text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Clique para adicionar uma imagem
                                    </p>
                                </div>
                            )}
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Serviço</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Digite o nome do serviço"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Digite a descrição do serviço"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preço</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="R$ 0.00"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duração (minutos)</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="60"
                                                    min="5"
                                                    className="pr-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <Clock size={16} className="text-muted-foreground" />
                                            </div>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Digite a categoria"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>Cadastrando...</span>
                                    </>
                                ) : (
                                    "Cadastrar Serviço"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
