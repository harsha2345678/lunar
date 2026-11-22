import { NavLink } from 'react-router-dom';
import logo from '../assets/images/logo.png';

export const NAV_ITEMS = [
  { to: '/', label: 'Mission Overview' },
  { to: '/image-analysis', label: 'Image Analysis' },
  { to: '/boulder-detection', label: 'Boulder Detection' },
  { to: '/lander-risk', label: 'Lander Risk' },
  { to: '/rover-navigation', label: 'Rover Navigation' },
  { to: '/mission-analytics', label: 'Mission Analytics' },
];

export default function Sidebar({ id, isOpen }) {
  return (
    <aside id={id} className={`sidebar${isOpen ? ' is-open' : ''}`}>
      <div className="sidebar-brand">
        <img className="brand-logo" src={logo} alt="Lunar Sentry AI logo" />
        <span className="brand-name">LUNAR SENTRY AI</span>
      </div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `sidebar-link${isActive ? ' is-active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-status" role="status" aria-live="polite">
        <span className="status-dot" />
        <span className="status-text">ARTEMIS-IV NOMINAL</span>
      </div>
    </aside>
  );
}
