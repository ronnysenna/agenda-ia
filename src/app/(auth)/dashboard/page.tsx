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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Visualize métricas de agendamentos em tempo real
          </p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard
          title="Total de Agendamentos"
          value="42"
          icon={<CalendarCheck size={18} />}
          trend={{ value: 12, isPositive: true }}
          description="Nos últimos 30 dias"
          variant="primary"
        />

        <DashboardCard
          title="Taxa de Comparecimento"
          value="87%"
          icon={<CheckCircle size={18} />}
          trend={{ value: 4, isPositive: true }}
          description="Clientes presentes"
          variant="success"
        />

        <DashboardCard
          title="Conexões WhatsApp"
          value="1"
          icon={<QrCode size={18} />}
          description="Dispositivos conectados"
          variant="primary"
        />

        <DashboardCard
          title="Novos Clientes"
          value="18"
          icon={<Users size={18} />}
          trend={{ value: 7, isPositive: true }}
          description="Mês atual"
        />

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 card-status-success">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-glass p-3 rounded-4 me-3">
                  <CheckCircle className="text-success" size={24} />
                </div>
                <h6 className="card-title text-success mb-0 fw-semibold">
                  Taxa de Comparecimento
                </h6>
              </div>
              <h3 className="mb-0 gradient-number display-6">87%</h3>
              <small className="text-muted fw-medium">Clientes presentes</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 card-status-info">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-glass p-3 rounded-4 me-3">
                  <QrCode className="text-info" size={24} />
                </div>
                <h6 className="card-title text-info mb-0 fw-semibold">
                  Conexões WhatsApp
                </h6>
              </div>
              <h3 className="mb-0 gradient-number display-6">1</h3>
              <small className="text-muted fw-medium">Dispositivos conectados</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 card-status-warning">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-glass p-3 rounded-4 me-3">
                  <Users className="text-warning" size={24} />
                </div>
                <h6 className="card-title text-warning mb-0 fw-semibold">
                  Clientes
                </h6>
              </div>
              <h3 className="mb-0 gradient-number display-6">28</h3>
              <small className="text-muted fw-medium">
                Clientes únicos
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos e Estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Agendamentos dos Últimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-md">
              <div className="text-center flex flex-col items-center">
                <LineChart className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-muted-foreground">Gráfico de agendamentos será exibido aqui</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "appt-1", name: "João Silva", service: "Corte de cabelo", time: "Hoje, 14:30" },
              { id: "appt-2", name: "Maria Oliveira", service: "Manicure", time: "Hoje, 15:00" },
              { id: "appt-3", name: "Carlos Santos", service: "Barba", time: "Hoje, 16:15" }
            ].map((appt) => (
              <div key={appt.id} className="flex items-start gap-3 p-3 border rounded-lg">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Status dos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-sm">Confirmados</span>
                </div>
                <span className="font-medium">24</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-sm">Pendentes</span>
                </div>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-sm">Cancelados</span>
                </div>
                <span className="font-medium">6</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Serviços Mais Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">1</span>
                  <span className="text-sm">Corte de Cabelo</span>
                </div>
                <span className="font-medium">18</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">2</span>
                  <span className="text-sm">Barba</span>
                </div>
                <span className="font-medium">14</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">3</span>
                  <span className="text-sm">Hidratação</span>
                </div>
                <span className="font-medium">10</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Faturamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R$ 3.240</p>
                  <p className="text-xs text-muted-foreground">Mês atual</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 flex justify-between items-center">
                <span className="text-sm">Mês anterior</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">R$ 2.980</span>
                  <span className="text-xs text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3" /> 8.7%
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
