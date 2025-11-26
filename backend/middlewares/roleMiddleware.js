export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Not authenticated",
          error: true,
          success: false,
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Forbidden: Access denied",
          error: true,
          success: false,
        });
      }

      next();
    } catch (error) {
      console.error("Authorization middleware error:", error);
      return res.status(500).json({
        message: "Authorization error",
        error: true,
        success: false,
      });
    }
  };
};
