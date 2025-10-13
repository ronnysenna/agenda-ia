"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Camera, Loader2, Save, Check, AlertCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// Define o esquema de validação com os valores padrão
const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().optional(),
  cpfCnpj: z.string().optional(),
  address: z.string().optional(),
  image: z.any().optional(),
  // Campos de preferências de agendamento
  appointmentBuffer: z.number().min(0).default(15),
  allowClientCancellation: z.boolean().default(true),
  confirmationRequired: z.boolean().default(false),
  sendWhatsAppConfirmation: z.boolean().default(true),
});

// Tipo derivado do esquema
type ProfileFormValues = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Inicializa o formulário com os valores padrão e tipagem explícita
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema) as Resolver<ProfileFormValues>,
    defaultValues: {
      name: "",
      phone: "",
      cpfCnpj: "",
      address: "",
      appointmentBuffer: 15,
      allowClientCancellation: true,
      confirmationRequired: false,
      sendWhatsAppConfirmation: true
    },
  });

  // Carregar dados do perfil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // Simular carregamento de dados da API
        setTimeout(() => {
          // Dados de exemplo
          const mockData = {
            name: "João Silva",
            phone: "(11) 98765-4321",
            cpfCnpj: "123.456.789-00",
            address: "Rua Exemplo, 123 - São Paulo, SP",
            profileImageUrl: "https://i.pravatar.cc/300",
            appointmentBuffer: 15,
            allowClientCancellation: true,
            confirmationRequired: false,
            sendWhatsAppConfirmation: true
          };
          form.reset(mockData);
          setPreviewUrl(mockData.profileImageUrl);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        setIsLoading(false);
        setFeedbackMessage({
          type: 'error',
          text: 'Não foi possível carregar os dados do perfil'
        });
      }
    };

    fetchProfile();
  }, [form]);

  // Manipular envio do formulário
  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    try {
      setIsLoading(true);
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Dados enviados:", data);

      setFeedbackMessage({
        type: 'success',
        text: 'Perfil atualizado com sucesso!'
      });
      setIsEditing(false);
      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      setFeedbackMessage({
        type: 'error',
        text: 'Erro ao salvar alterações'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Manipular upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        form.setValue("image", file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout userName={form.watch("name") || "Usuário"}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Perfil</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e preferências de agendamento
            </p>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Editar Perfil
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // Restaurar os valores originais
                    form.reset();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Salvar Alterações
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mensagem de feedback */}
        {feedbackMessage && (
          <div className={`p-4 mb-4 rounded-lg flex items-center gap-3 
            ${feedbackMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
            {feedbackMessage.type === 'success' ?
              <Check size={20} className="text-emerald-500" /> :
              <AlertCircle size={20} className="text-red-500" />
            }
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {isLoading && !form.formState.isSubmitting ? (
          <div className="flex justify-center my-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form className="space-y-8">
              {/* Informações pessoais */}
              <Card className="dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Informações Pessoais</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Atualize suas informações básicas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary flex items-center justify-center bg-muted">
                          {previewUrl ? (
                            <Image
                              src={previewUrl}
                              alt="Foto de perfil"
                              width={96}
                              height={96}
                              className="object-cover w-full h-full"
                              priority
                            />
                          ) : (
                            <span className="text-4xl text-muted-foreground">
                              {form.watch("name").charAt(0) || "U"}
                            </span>
                          )}
                        </div>
                        {isEditing && (
                          <label
                            htmlFor="profile-image"
                            className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer"
                          >
                            <Camera size={16} />
                            <input
                              type="file"
                              id="profile-image"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-1 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-800 dark:text-gray-200">Nome</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Seu nome completo"
                                disabled={!isEditing}
                                className="text-gray-800 dark:text-gray-200"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-800 dark:text-gray-200">Telefone / WhatsApp</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(00) 00000-0000"
                                disabled={!isEditing}
                                className="text-gray-800 dark:text-gray-200"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="cpfCnpj"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800 dark:text-gray-200">CPF / CNPJ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="000.000.000-00"
                              disabled={!isEditing}
                              className="text-gray-800 dark:text-gray-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800 dark:text-gray-200">Endereço</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Rua, número, bairro, cidade - UF"
                              disabled={!isEditing}
                              className="text-gray-800 dark:text-gray-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Preferências de agendamento */}
              <Card className="dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Preferências de Agendamento</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Configure como os agendamentos funcionam</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="appointmentBuffer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 dark:text-gray-200">Tempo entre agendamentos (minutos)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            disabled={!isEditing}
                            className="text-gray-800 dark:text-gray-200"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-600 dark:text-gray-400">
                          Tempo de intervalo entre um agendamento e outro
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="allowClientCancellation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 dark:border-gray-700">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-gray-800 dark:text-gray-200">Permitir cancelamento</FormLabel>
                            <FormDescription className="text-gray-600 dark:text-gray-400">
                              Clientes podem cancelar seus agendamentos
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!isEditing}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmationRequired"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 dark:border-gray-700">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-gray-800 dark:text-gray-200">Exigir confirmação</FormLabel>
                            <FormDescription className="text-gray-600 dark:text-gray-400">
                              Agendamentos precisam ser confirmados por você
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!isEditing}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sendWhatsAppConfirmation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 dark:border-gray-700">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base text-gray-800 dark:text-gray-200">Enviar confirmação por WhatsApp</FormLabel>
                            <FormDescription className="text-gray-600 dark:text-gray-400">
                              Notificações automáticas serão enviadas para o WhatsApp do cliente
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!isEditing}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        )}
      </div>
    </DashboardLayout>
  );
}
