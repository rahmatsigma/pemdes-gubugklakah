
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SimpleBarChartProps {
  data: any[];
  dataKey: string;      // Sumbu Y (nilai/angka yang diukur)
  categoryKey: string;  // Sumbu X (label kategori, misal: 'Laki-laki', 'Perempuan')
  color?: string;       // Warna solid utama (default: Tailwind primary-600)
}

// Kustomisasi Tooltip agar bergaya Flat
const FlatTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-2 border-neutral-900 px-4 py-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-neutral-900 mb-1">{label}</p>
        <p className="text-primary-700">{`${payload[0].value} Jiwa`}</p>
      </div>
    );
  }
  return null;
};

export default function SimpleBarChart({ data, dataKey, categoryKey, color = "#4f46e5" }: SimpleBarChartProps) {
  // Jika data kosong, tampilkan placeholder
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-lg">
        <p className="text-neutral-500 font-medium">Tidak ada data statistik.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          {/* Grid tipis, hanya horizontal */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
          
          <XAxis 
            dataKey={categoryKey} 
            tick={{ fill: '#525252', fontSize: 12, fontWeight: 'bold' }} 
            axisLine={{ stroke: '#a3a3a3', strokeWidth: 2 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#525252', fontSize: 12, fontWeight: 'bold' }} 
            axisLine={{ stroke: '#a3a3a3', strokeWidth: 2 }}
            tickLine={false}
          />
          
          <Tooltip content={<FlatTooltip />} cursor={{ fill: '#f3f4f6' }} />
          
          <Bar 
            dataKey={dataKey} 
            fill={color} 
            radius={[4, 4, 0, 0]} 
            // Efek stroke tebal khas brutalism/flat
            stroke="#171717"
            strokeWidth={2}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}