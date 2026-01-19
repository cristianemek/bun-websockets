import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const PARTY_COLORS = [
  { bg: "rgba(220, 53, 69, 0.2)", border: "rgb(220, 53, 69)" },
  { bg: "rgba(0, 123, 255, 0.2)", border: "rgb(0, 123, 255)" },
  { bg: "rgba(40, 167, 69, 0.2)", border: "rgb(40, 167, 69)" },
  { bg: "rgba(255, 193, 7, 0.2)", border: "rgb(255, 193, 7)" },
  { bg: "rgba(255, 152, 0, 0.2)", border: "rgb(255, 152, 0)" },
  { bg: "rgba(153, 102, 255, 0.2)", border: "rgb(153, 102, 255)" },
  { bg: "rgba(75, 192, 192, 0.2)", border: "rgb(75, 192, 192)" },
  { bg: "rgba(255, 99, 132, 0.2)", border: "rgb(255, 99, 132)" },
];

const PARTIES = [
  { id: 1, name: "Partido Rojo", votes: 35 },
  { id: 2, name: "Partido Azul", votes: 42 },
  { id: 3, name: "Partido Verde", votes: 28 },
  { id: 4, name: "Partido Amarillo", votes: 23 },
  { id: 5, name: "Partido Naranja", votes: 15 },
];

const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Votos por Partido Político",
      color: "white",
      font: { size: 16 },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Cantidad de votos",
        color: "rgba(255, 255, 255, 0.7)",
      },
      ticks: { color: "rgba(255, 255, 255, 0.7)" },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
    },
    x: {
      title: {
        display: true,
        text: "Partidos Políticos",
        color: "rgba(255, 255, 255, 0.7)",
        font: { size: 16, weight: 600 },
      },
      ticks: { color: "rgba(255, 255, 255, 0.7)" },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
    },
  },
};

const chartData: ChartData<"bar"> = {
  labels: PARTIES.map((p) => p.name),
  datasets: [
    {
      data: PARTIES.map((p) => p.votes),
      backgroundColor: PARTY_COLORS.map((c) => c.bg),
      borderColor: PARTY_COLORS.map((c) => c.border),
      borderWidth: 2,
    },
  ],
};

export const HomePage = () => {
  return (
    <div className="chart-container">
      <h1>Resultados Electorales</h1>

      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
