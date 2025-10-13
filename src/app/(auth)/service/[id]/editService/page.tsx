"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Loader2, ArrowLeft, Clock, Trash2, AlertCircle, CheckCircle } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const schema = z.object({
    name: z.string().min(1, "Nome do serviço é obrigatório"),
    description: z.string().optional(),
    price: z.string().min(1, "Preço é obrigatório"),
    duration: z.string().min(1, "Duração é obrigatória"),
    category: z.string().optional(),
    image: z.any().optional(),
});

type ServiceFormData = z.infer<typeof schema>;

// Interface removida por não estar sendo utilizada

export default function EditServicePage(props: { params: { id: string } }) {
    const { params } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    // Removida a variável service não utilizada
    // const [service, setService] = useState<Service | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    const router = useRouter();

    const form = useForm<ServiceFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            description: "",
            price: "",
            duration: "",
            category: "",
        },
    });

    // Buscar dados do serviço
    useEffect(() => {
        const fetchService = async () => {
            setIsFetching(true);
            setError(null);

            try {
                const response = await fetch(`/api/service/${params.id}`);

                if (!response.ok) {
                    throw new Error("Serviço não encontrado");
                }

                const data = await response.json();

                // Preencher o formulário com os dados
                form.reset({
                    name: data.name,
                    description: data.description || "",
                    price: data.price?.toString() || "",
                    duration: data.duration?.toString() || "",
                    category: data.category || "",
                });

                // Exibir a imagem se existir
                if (data.imageUrl) {
                    setPreviewUrl(data.imageUrl);
                }
            } catch (error) {
                console.error("Erro ao carregar serviço:", error);
                setError("Não foi possível carregar os dados do serviço");
            } finally {
                setIsFetching(false);
            }
        };

        fetchService();
    }, [params.id, form]);

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
        setFeedbackMessage(null);

        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== "") {
                    formData.append(key, value);
                }
            });

            const response = await fetch(`/api/service/${params.id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) throw new Error("Erro ao atualizar serviço");

            setFeedbackMessage({
                type: "success",
                text: "Serviço atualizado com sucesso!"
            });

            setTimeout(() => {
                router.push("/service/catalog");
            }, 2000);

        } catch (error) {
            console.error("Erro ao atualizar serviço:", error);
            setFeedbackMessage({
                type: "error",
                text: "Erro ao atualizar serviço. Tente novamente."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        // Confirmação antes de excluir
        if (!window.confirm("Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.")) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch(`/api/service/${params.id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.appointmentsCount) {
                    throw new Error(`Este serviço possui ${data.appointmentsCount} agendamentos e não pode ser excluído.`);
                }
                throw new Error("Erro ao excluir serviço");
            }

            setFeedbackMessage({
                type: "success",
                text: "Serviço excluído com sucesso!"
            });

            setTimeout(() => {
                router.push("/service/catalog");
            }, 2000);

        } catch (error) {
            console.error("Erro ao excluir serviço:", error);
            setFeedbackMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Erro ao excluir serviço"
            });
        } finally {
            setIsDeleting(false);
        }
    };

    if (isFetching) {
        return (
            <div className="container mx-auto py-6 px-4 max-w-3xl">
                <Card className="p-6 flex justify-center items-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                        <p className="text-muted-foreground">Carregando dados do serviço...</p>
                    </div>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-6 px-4 max-w-3xl">
                <Card className="p-6">
                    <div className="flex flex-col items-center py-8">
                        <div className="rounded-full bg-destructive/20 p-3 mb-4">
                            <AlertCircle size={32} className="text-destructive" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">Erro</h3>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <Button onClick={() => router.push("/service/catalog")}>
                            Voltar para o catálogo
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 px-4 max-w-3xl">
            {feedbackMessage && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${feedbackMessage.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                        : 'bg-destructive/15 text-destructive'
                    }`}>
                    {feedbackMessage.type === 'success' ? (
                        <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                    ) : (
                        <AlertCircle size={20} />
                    )}
                    <p>{feedbackMessage.text}</p>
                </div>
            )}

            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push("/service/catalog")}
                        >
                            <ArrowLeft size={20} />
                            <span className="sr-only">Voltar</span>
                        </Button>
                        <h1 className="text-2xl font-bold">Editar Serviço</h1>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-1"
                    >
                        {isDeleting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Trash2 size={16} />
                        )}
                        <span>{isDeleting ? "Excluindo..." : "Excluir"}</span>
                    </Button>
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
                                        Clique para alterar a imagem
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

                <Separator className="mb-6" />

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
                                        <Textarea
                                            placeholder="Digite a descrição do serviço"
                                            rows={3}
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

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    "Salvar Alterações"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
