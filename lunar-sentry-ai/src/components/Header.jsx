import logo from '../assets/images/logo.png';
import avatar from '../assets/images/avatar.png';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-brand">
        <img className="brand-logo" src={logo} alt="Lunar Sentry AI logo" />
        <span className="brand-name">LUNAR SENTRY AI</span>
      </div>
      <div className="header-right">
        <div className="header-status">
          <span className="status-dot" />
          <span className="status-text">ARTEMIS-IV NOMINAL</span>
        </div>
        <button className="header-bell" aria-label="Notifications">
          <span className="bell-dot" />
        </button>
        <img className="header-avatar has-image" src={avatar} alt="User profile" />
      </div>
    </header>
  );
}
