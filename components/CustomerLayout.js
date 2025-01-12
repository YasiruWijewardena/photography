// components/CustomerLayout.js

import PropTypes from 'prop-types';
import CustomerSidebar from './CustomerSidebar';

export default function CustomerLayout({ children, username }) {
  return (
    <div className="customer-layout">
      <CustomerSidebar username={username} />
      <main className="customer-main-content">
        {children}
      </main>
      <style jsx>{`
        .customer-layout {
          display: flex;
        }

        .customer-main-content {
          margin-left: 250px; /* Same as sidebar width */
          padding: 20px;
          flex: 1;
        }
      `}</style>
    </div>
  );
}

CustomerLayout.propTypes = {
  children: PropTypes.node.isRequired,
  username: PropTypes.string.isRequired,
};