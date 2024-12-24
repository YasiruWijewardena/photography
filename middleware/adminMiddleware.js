// middleware/adminMiddleware.js

import { getSession } from 'next-auth/react';

export function withAdminAuth(requiredLevel, handler) {
  return async (req, res) => {
    const session = await getSession({ req });
    if (
      !session ||
      session.user.role !== 'admin' ||
      !hasRequiredAdminLevel(session.user.admin_level, requiredLevel)
    ) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    return handler(req, res);
  };
}

function hasRequiredAdminLevel(userLevel, requiredLevel) {
  const levels = {
    SUPER: 2,
    BASIC: 1,
  };
  return levels[userLevel] >= levels[requiredLevel];
}

