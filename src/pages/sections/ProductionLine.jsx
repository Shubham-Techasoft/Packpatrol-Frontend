import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "10:00", biscuits: 200 },
  { name: "10:05", biscuits: 400 },
  { name: "10:10", biscuits: 350 },
  { name: "10:15", biscuits: 500 },
];

const ProductionLine = () => (
  <div>
    <h2>Live Biscuit Production</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="biscuits"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
export default ProductionLine;
