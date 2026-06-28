

/**
 * Base shimmer skeleton block.
 * Usage: <Skeleton width="100%" height={20} borderRadius={6} />
 */
export const Skeleton = ({ width = '100%', height = 16, borderRadius = 6, style = {} }) => (
  <div
    className="skeleton"
    style={{ width, height, borderRadius, flexShrink: 0, ...style }}
  />
);

/**
 * A single skeleton course card (mirrors the real course card layout).
 */
export const SkeletonCourseCard = () => (
  <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Skeleton width="60px" height={20} borderRadius={12} />
      <Skeleton width="70px" height={14} borderRadius={4} />
    </div>
    <Skeleton width="80%" height={20} borderRadius={6} />
    <Skeleton width="100%" height={14} borderRadius={4} />
    <Skeleton width="75%" height={14} borderRadius={4} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
      <Skeleton width="90px" height={14} borderRadius={4} />
      <Skeleton width="70px" height={32} borderRadius={6} />
    </div>
  </div>
);

/**
 * Grid of skeleton course cards.
 */
export const SkeletonCourseGrid = ({ count = 6 }) => (
  <div className="grid-cards">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCourseCard key={i} />
    ))}
  </div>
);

/**
 * A single skeleton list row (for assignments, quizzes, etc.).
 */
export const SkeletonListItem = ({ showAvatar = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', borderBottom: '1px solid var(--border-color)' }}>
    {showAvatar && <Skeleton width={36} height={36} borderRadius={18} />}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Skeleton width="55%" height={16} borderRadius={4} />
      <Skeleton width="35%" height={13} borderRadius={4} />
    </div>
    <Skeleton width="70px" height={30} borderRadius={6} />
  </div>
);

/**
 * Stacked list of skeleton rows.
 */
export const SkeletonList = ({ count = 4, showAvatar = false }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonListItem key={i} showAvatar={showAvatar} />
    ))}
  </div>
);

/**
 * Skeleton for the main full-page course load.
 */
export const SkeletonDashboard = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    {/* Section header */}
    <div className="card" style={{ padding: '24px' }}>
      <Skeleton width="220px" height={24} borderRadius={6} style={{ marginBottom: '20px' }} />
      <SkeletonCourseGrid count={3} />
    </div>
    <div className="card" style={{ padding: '24px' }}>
      <Skeleton width="200px" height={24} borderRadius={6} style={{ marginBottom: '20px' }} />
      <SkeletonCourseGrid count={3} />
    </div>
  </div>
);

/**
 * Small inline skeleton for loading a material card.
 */
export const SkeletonMaterialCard = () => (
  <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Skeleton width="80px" height={22} borderRadius={12} />
      <Skeleton width="40px" height={18} borderRadius={4} />
    </div>
    <Skeleton width="70%" height={18} borderRadius={4} />
    <Skeleton width="100%" height={13} borderRadius={4} />
    <Skeleton width="85%" height={13} borderRadius={4} />
    <Skeleton width="90px" height={32} borderRadius={6} style={{ marginTop: '6px' }} />
  </div>
);

export const SkeletonMaterialGrid = ({ count = 4 }) => (
  <div className="grid-cards">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonMaterialCard key={i} />
    ))}
  </div>
);

export default Skeleton;
