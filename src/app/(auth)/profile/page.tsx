"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Camera, Loader2, Save, Check, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CollaboratorsSection from "./CollaboratorsSection";

// Define o esquema de validação com os valores padrão
const formSchema = z.object({
  name: z.string().min(1, "Nome da empresa é obrigatório"),
  phone: z.string().optional(),
  cpfCnpj: z.string().optional(),
  address: z.string().optional(),
  site: z.string().optional(),
  email: z.string().email("E-mail inválido").optional(),
  description: z.string().optional(),
  image: z.any().optional(),
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
      site: "",
      email: "",
      description: "",
    },
  });

  // Carregar dados do perfil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/profile");
        const data = await res.json();
        form.reset(data);
        setPreviewUrl(data.image || null);
        setIsLoading(false);
        setFeedbackMessage(null);
      } catch {
        setIsLoading(false);
        setFeedbackMessage({
          type: 'error',
          text: 'Não foi possível carregar os dados do perfil'
        });
      }
    };
    fetchProfile();
  }, [form, form.reset]);

  // Manipular envio do formulário
  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone || "");
      formData.append("cpfCnpj", data.cpfCnpj || "");
      formData.append("address", data.address || "");
      formData.append("site", data.site || "");
      formData.append("email", data.email || "");
      formData.append("description", data.description || "");
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }
      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      });
      if (res.ok) {
        setFeedbackMessage({
          type: 'success',
          text: 'Perfil atualizado com sucesso!'
        });
        setIsEditing(false);
        setTimeout(() => {
          setFeedbackMessage(null);
        }, 3000);
        // Atualiza imagem do preview
        const updated = await res.json();
        setPreviewUrl(updated.image || previewUrl);
      } else {
        setFeedbackMessage({
          type: 'error',
          text: 'Erro ao salvar alterações'
        });
      }
    } catch {
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
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Perfil da Empresa</h1>
            <p className="text-gray-500 text-base">Gerencie as informações do seu salão e equipe de forma prática.</p>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 bg-primary text-white rounded-full shadow hover:bg-primary/90 transition-colors font-semibold"
              >
                Editar Perfil
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); form.reset(); }}
                  className="px-5 py-2 border border-gray-300 rounded-full bg-white text-gray-800 shadow hover:bg-gray-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
                  className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-full shadow hover:bg-primary/90 disabled:opacity-70 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Salvar Alterações
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mensagem de feedback */}
        {feedbackMessage && (
          <div className={`p-4 mb-4 rounded-xl flex items-center gap-3 shadow-lg font-medium text-base
            ${feedbackMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {feedbackMessage.type === 'success' ?
              <Check size={22} className="text-emerald-500" /> :
              <AlertCircle size={22} className="text-red-500" />
            }
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {isLoading && !form.formState.isSubmitting ? (
          <div className="flex justify-center my-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Card principal */}
              <Card className="border-gray-200 bg-white rounded-2xl shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-xl font-bold">Informações da Empresa</CardTitle>
                  <CardDescription className="text-gray-500">Atualize os dados do seu salão de beleza</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 bg-white">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-2">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-primary flex items-center justify-center bg-gray-100 shadow">
                          {previewUrl ? (
                            <Image
                              src={previewUrl}
                              alt="Foto de perfil"
                              width={160}
                              height={160}
                              className="object-cover w-full h-full"
                              priority
                            />
                          ) : (
                            <span className="text-6xl text-gray-400 font-bold">
                              {form.watch("name").charAt(0) || "U"}
                            </span>
                          )}
                        </div>
                        {isEditing && (
                          <label
                            htmlFor="profile-image"
                            className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg border border-white"
                          >
                            <Camera size={18} />
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
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-800 font-semibold">Nome</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nome da empresa"
                                disabled={!isEditing}
                                className="text-gray-800 bg-white border-gray-300 rounded-xl shadow focus:ring-primary focus:border-primary"
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
                            <FormLabel className="text-gray-800 font-semibold">Telefone / WhatsApp</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(00) 00000-0000"
                                disabled={!isEditing}
                                className="text-gray-800 bg-white border-gray-300 rounded-xl shadow focus:ring-primary focus:border-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cpfCnpj"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-800 font-semibold">CNPJ</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="00.000.000/0000-00"
                                disabled={!isEditing}
                                className="text-gray-800 bg-white border-gray-300 rounded-xl shadow focus:ring-primary focus:border-primary"
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
                            <FormLabel className="text-gray-800 font-semibold">Endereço</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Rua, número, bairro, cidade - UF"
                                disabled={!isEditing}
                                className="text-gray-800 bg-white border-gray-300 rounded-xl shadow focus:ring-primary focus:border-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="site"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-800 font-semibold">Site</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://www.seusalao.com.br"
                                disabled={!isEditing}
                                className="text-gray-800 bg-white border-gray-300 rounded-xl shadow focus:ring-primary focus:border-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-800 font-semibold">E-mail</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="contato@seusalao.com.br"
                                disabled={!isEditing}
                                className="text-gray-800 bg-white border-gray-300 rounded-xl shadow focus:ring-primary focus:border-primary"
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
                            <FormLabel className="text-gray-800 font-semibold">Descrição</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Breve descrição do salão, especialidades, diferenciais..."
                                disabled={!isEditing}
                                className="text-gray-800 bg-white border-gray-300 rounded-xl shadow focus:ring-primary focus:border-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card de colaboradores */}
              <Card className="border-gray-200 bg-white rounded-2xl shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-xl font-bold">Colaboradores</CardTitle>
                  <CardDescription className="text-gray-500">Adicione e gerencie os profissionais do seu salão</CardDescription>
                </CardHeader>
                <CardContent>
                  <CollaboratorsSection />
                </CardContent>
              </Card>
            </form>
          </Form>
        )}
      </div>
    </DashboardLayout>
  );
}
