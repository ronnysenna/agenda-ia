import { useEffect, useState } from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

interface Collaborator {
    id: string;
    name: string;
    role: string;
    phone?: string;
    imageUrl?: string;
}

export default function CollaboratorsSection() {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [newColab, setNewColab] = useState({ name: "", role: "", phone: "", imageUrl: "" });
    const [editColab, setEditColab] = useState<string | null>(null);
    const [editData, setEditData] = useState({ name: "", role: "", phone: "", imageUrl: "" });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/collaborator")
            .then(async (res) => {
                if (!res.ok) {
                    setCollaborators([]);
                    return;
                }
                try {
                    const data = await res.json();
                    setCollaborators(data);
                } catch {
                    setCollaborators([]);
                }
            });
    }, []);

    const handleAdd = async () => {
        setLoading(true);
        setAlert(null);
        const res = await fetch("/api/collaborator", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newColab),
        });
        if (res.ok) {
            const colab = await res.json();
            setCollaborators((prev) => [...prev, colab]);
            setNewColab({ name: "", role: "", phone: "", imageUrl: "" });
            setAlert("Colaborador adicionado com sucesso!");
            setTimeout(() => setAlert(null), 2000);
        } else {
            setAlert("Erro ao adicionar colaborador.");
            setTimeout(() => setAlert(null), 2000);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        setAlert(null);
        const res = await fetch(`/api/collaborator/${id}`, { method: "DELETE" });
        if (res.ok) {
            setCollaborators((prev) => prev.filter((c) => c.id !== id));
            setAlert("Colaborador removido!");
            setTimeout(() => setAlert(null), 2000);
        } else {
            setAlert("Erro ao remover colaborador.");
            setTimeout(() => setAlert(null), 2000);
        }
        setLoading(false);
    };

    const handleEdit = async (id: string) => {
        setLoading(true);
        setAlert(null);
        const res = await fetch(`/api/collaborator/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editData),
        });
        if (res.ok) {
            const updated = await res.json();
            setCollaborators((prev) => prev.map((c) => c.id === id ? updated : c));
            setAlert("Colaborador atualizado!");
            setTimeout(() => setAlert(null), 2000);
            setEditColab(null);
        } else {
            setAlert("Erro ao editar colaborador.");
            setTimeout(() => setAlert(null), 2000);
        }
        setLoading(false);
    };

    const handleColabImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setNewColab((prev) => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            {alert && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded text-white shadow-lg ${alert.includes('sucesso') || alert.includes('atualizado') ? 'bg-green-600' : 'bg-red-600'}`}>{alert}</div>
            )}
            <div className="flex flex-wrap gap-4">
                {/* Card de adicionar colaborador */}
                <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center w-72 order-first">
                    <h4 className="font-semibold mb-3 text-gray-900 text-lg">Adicionar colaborador</h4>
                    <div className="flex flex-col gap-3 w-full">
                        <Input placeholder="Nome" value={newColab.name} onChange={e => setNewColab({ ...newColab, name: e.target.value })} className="bg-white border-gray-300 text-gray-800 rounded-xl shadow focus:ring-primary focus:border-primary" />
                        <Input placeholder="Função" value={newColab.role} onChange={e => setNewColab({ ...newColab, role: e.target.value })} className="bg-white border-gray-300 text-gray-800 rounded-xl shadow focus:ring-primary focus:border-primary" />
                        <Input placeholder="Telefone" value={newColab.phone} onChange={e => setNewColab({ ...newColab, phone: e.target.value })} className="bg-white border-gray-300 text-gray-800 rounded-xl shadow focus:ring-primary focus:border-primary" />
                        <Input placeholder="URL da foto" value={newColab.imageUrl} onChange={e => setNewColab({ ...newColab, imageUrl: e.target.value })} className="bg-white border-gray-300 text-gray-800 rounded-xl shadow focus:ring-primary focus:border-primary" />
                        <Button asChild className="bg-primary text-white rounded-xl shadow font-semibold">
                            <label>
                                Buscar imagem
                                <input type="file" accept="image/*" className="hidden" onChange={handleColabImageUpload} />
                            </label>
                        </Button>
                        <Button onClick={handleAdd} disabled={loading || !newColab.name || !newColab.role} className="bg-primary text-white rounded-xl shadow font-semibold">Adicionar</Button>
                    </div>
                </div>
                {/* Cards dos colaboradores já adicionados */}
                {collaborators.length === 0 && (
                    <div className="py-6 text-center text-muted-foreground w-full">Nenhum colaborador cadastrado.</div>
                )}
                {collaborators.map((colab) => (
                    <div key={colab.id} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center w-72">
                        {editColab === colab.id ? (
                            <>
                                <div className="mb-2 w-full">
                                    <label htmlFor={`edit-name-${colab.id}`} className="block text-sm font-semibold mb-1">Nome</label>
                                    <Input id={`edit-name-${colab.id}`} value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} className="bg-white border-gray-300 text-gray-800 rounded-xl shadow focus:ring-primary focus:border-primary mb-2" />
                                    <label htmlFor={`edit-role-${colab.id}`} className="block text-sm font-semibold mb-1">Função</label>
                                    <Input id={`edit-role-${colab.id}`} value={editData.role} onChange={e => setEditData({ ...editData, role: e.target.value })} className="bg-white border-gray-300 text-gray-800 rounded-xl shadow focus:ring-primary focus:border-primary mb-2" />
                                    <label htmlFor={`edit-phone-${colab.id}`} className="block text-sm font-semibold mb-1">Telefone</label>
                                    <Input id={`edit-phone-${colab.id}`} value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} className="bg-white border-gray-300 text-gray-800 rounded-xl shadow focus:ring-primary focus:border-primary mb-2" />
                                    <label htmlFor={`edit-imageUrl-${colab.id}`} className="block text-sm font-semibold mb-1">URL da foto</label>
                                    <Input id={`edit-imageUrl-${colab.id}`} value={editData.imageUrl} onChange={e => setEditData({ ...editData, imageUrl: e.target.value })} className="bg-white border-gray-300 text-gray-800 rounded-xl shadow focus:ring-primary focus:border-primary" />
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Button size="sm" onClick={() => handleEdit(colab.id)} disabled={loading} className="rounded-xl shadow font-semibold">Salvar</Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditColab(null)} className="rounded-xl shadow font-semibold">Cancelar</Button>
                                </div>
                            </>
                        ) : (
                            <>
                                {colab.imageUrl ? (
                                    <Image src={colab.imageUrl} alt={colab.name} width={128} height={128} className="rounded-full object-cover border mb-4 aspect-square shadow" />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold border mb-4 shadow">
                                        {colab.name.charAt(0)}
                                    </div>
                                )}
                                <div className="flex flex-col items-center w-full mb-4">
                                    <div className="font-bold text-xl text-gray-900 text-center mb-2 capitalize">{colab.name}</div>
                                    <div className="text-base text-gray-500 text-center font-medium mb-2 capitalize">{colab.role}</div>
                                    {colab.phone && <div className="text-sm text-gray-500 text-center mb-2">{colab.phone}</div>}
                                </div>
                                <div className="flex gap-2 mt-2 mb-2">
                                    <Button size="sm" variant="outline" onClick={() => { setEditColab(colab.id); setEditData({ name: colab.name, role: colab.role, phone: colab.phone || "", imageUrl: colab.imageUrl || "" }); }} className="rounded-xl shadow font-semibold"><Pencil size={16} /></Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(colab.id)} disabled={loading} aria-label="Excluir colaborador" className="rounded-xl shadow font-semibold"><Trash2 size={20} color="#e53e3e" className="mr-0" /></Button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
