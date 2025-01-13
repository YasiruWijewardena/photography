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
    </div>
  );
}

CustomerLayout.propTypes = {
  children: PropTypes.node.isRequired,
  username: PropTypes.string.isRequired,
};