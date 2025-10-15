import { clsx } from 'clsx';

const Badge = ({
  children,
  variant = 'gray',
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    gray: 'badge-gray',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
  };

  return (
    <span
      className={clsx(
        'badge',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;

