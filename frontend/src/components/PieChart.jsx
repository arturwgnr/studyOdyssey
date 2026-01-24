const COLORS = ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#ef4444"];

function TopicDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return <p>No data yet...</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="minutes"
          nameKey="topic"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
