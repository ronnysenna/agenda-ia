import { getProtectedSession } from "@/lib/get-protected-session";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { DashboardCard } from "@/components/ui/dashboard-card";
import {
  CalendarCheck,
  CheckCircle,
  QrCode,
  Users,
  Calendar,
  LineChart,
  CreditCard,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Dashboard() {
  const session = await getProtectedSession();

  return (
    <DashboardLayout userName={session.user.name || "Usuário"}>
      {/* Título da página */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Visualize métricas de agendamentos em tempo real
          </p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total de Agendamentos"
          value="42"
          icon={<CalendarCheck size={20} />}
          trend={{ value: 12, isPositive: true }}
          description="Nos últimos 30 dias"
          variant="primary"
        />

        <DashboardCard
          title="Taxa de Comparecimento"
          value="87%"
          icon={<CheckCircle size={20} />}
          trend={{ value: 4, isPositive: true }}
          description="Clientes presentes"
          variant="success"
        />

        <DashboardCard
          title="Conexões WhatsApp"
          value="1"
          icon={<QrCode size={20} />}
          description="Dispositivos conectados"
          variant="primary"
        />

        <DashboardCard
          title="Novos Clientes"
          value="18"
          icon={<Users size={20} />}
          trend={{ value: 7, isPositive: true }}
          description="Mês atual"
          variant="warning"
        />
      </div>

      {/* Gráficos e Estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <LineChart size={20} className="text-primary" />
              Agendamentos dos Últimos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/30 rounded-md">
              <div className="text-center flex flex-col items-center">
                <LineChart className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-muted-foreground">Gráfico de agendamentos será exibido aqui</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Próximos Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {[
              { id: "appt-1", name: "João Silva", service: "Corte de cabelo", time: "Hoje, 14:30" },
              { id: "appt-2", name: "Maria Oliveira", service: "Manicure", time: "Hoje, 15:00" },
              { id: "appt-3", name: "Carlos Santos", service: "Barba", time: "Hoje, 16:15" }
            ].map((appt) => (
              <div key={appt.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{appt.name}</p>
                  <p className="text-sm text-muted-foreground">{appt.service}</p>
                  <p className="text-xs text-muted-foreground mt-1">{appt.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <CheckCircle size={20} className="text-primary" />
              Status dos Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-sm font-medium">Confirmados</span>
                </div>
                <span className="font-semibold text-lg">24</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-sm font-medium">Pendentes</span>
                </div>
                <span className="font-semibold text-lg">12</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-sm font-medium">Cancelados</span>
                </div>
                <span className="font-semibold text-lg">6</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Users size={20} className="text-primary" />
              Serviços Mais Populares
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">1</span>
                  <span className="text-sm font-medium">Corte de Cabelo</span>
                </div>
                <span className="font-semibold text-lg">18</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">2</span>
                  <span className="text-sm font-medium">Barba</span>
                </div>
                <span className="font-semibold text-lg">14</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">3</span>
                  <span className="text-sm font-medium">Hidratação</span>
                </div>
                <span className="font-semibold text-lg">10</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <CreditCard size={20} className="text-primary" />
              Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center gap-4 p-2 rounded-md">
                <div className="bg-green-500/10 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R$ 3.240</p>
                  <p className="text-sm text-muted-foreground">Mês atual</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex justify-between items-center">
                <span className="text-sm font-medium">Mês anterior</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">R$ 2.980</span>
                  <span className="text-xs text-green-600 flex items-center bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> 8.7%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
