import "./StatCard.css"

interface StatCardProps {
  title: string
  value: string
  icon: string
  color: string
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-icon" style={{ backgroundColor: `${color}15` }}>
        {icon}
      </div>
      <div className="stat-info">
        <p className="stat-label">{title}</p>
        <p className="stat-value" style={{ color }}>
          {value}
        </p>
      </div>
    </div>
  )
}
