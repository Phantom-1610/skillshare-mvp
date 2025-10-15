import { clsx } from 'clsx';

const Card = ({
  children,
  className = '',
  hover = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        hover ? 'card-hover' : 'card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

