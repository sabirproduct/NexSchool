import React, { Children, cloneElement, ReactElement, ReactNode, HTMLAttributes, ButtonHTMLAttributes, SelectHTMLAttributes } from 'react';

type WithSx = {
  sx?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
};

type SizeMap = { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };

const mergeStyle = (style?: React.CSSProperties, sx?: React.CSSProperties) => ({ ...style, ...sx });

const mapColor = (color?: string) => {
  switch (color) {
    case 'secondary':
      return 'secondary';
    case 'error':
      return 'danger';
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    case 'text.secondary':
      return '#6c757d';
    default:
      return undefined;
  }
};

const mapButtonColor = (color?: string) => {
  switch (color) {
    case 'secondary':
      return 'secondary';
    case 'error':
      return 'danger';
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'primary';
  }
};

const variantClassName = (variant?: string, color?: string) => {
  const btnColor = mapButtonColor(color);
  if (variant === 'contained') return `btn btn-${btnColor}`;
  if (variant === 'outlined') return `btn btn-outline-${btnColor}`;
  if (variant === 'text') return 'btn btn-link';
  return `btn btn-${btnColor}`;
};

export function Box({ children, className = '', style, sx, ...props }: WithSx & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} style={mergeStyle(style, sx)} {...props}>
      {children}
    </div>
  );
}

export function Stack({
  children,
  direction = 'column',
  spacing,
  alignItems,
  justifyContent,
  flexWrap,
  className = '',
  style,
  sx,
  ...props
}: WithSx & {
  direction?: 'row' | 'column';
  spacing?: number | string;
  alignItems?: string;
  justifyContent?: string;
  flexWrap?: string | boolean;
}) {
  const gap = spacing === undefined ? undefined : typeof spacing === 'number' ? `${spacing}rem` : spacing;
  const wrap = flexWrap === true ? 'flex-wrap' : typeof flexWrap === 'string' ? flexWrap : '';

  return (
    <div
      className={`d-flex ${direction === 'row' ? 'flex-row' : 'flex-column'} ${wrap} ${className}`.trim()}
      style={mergeStyle(style, { ...sx, gap, alignItems, justifyContent })}
      {...props}
    >
      {children}
    </div>
  );
}

const typographyMap: Record<string, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'small',
  overline: 'small',
  inherit: 'span',
};

export function Typography({
  children,
  variant = 'body1',
  component,
  className = '',
  sx,
  style,
  color,
  fontWeight,
  mb,
  ...props
}: WithSx & {
  variant?: string;
  component?: keyof JSX.IntrinsicElements;
  color?: string;
  fontWeight?: React.CSSProperties['fontWeight'];
  mb?: number | string;
}) {
  const Tag = component || typographyMap[variant] || 'p';
  const textColor = mapColor(color);
  return (
    <Tag
      className={className}
      style={mergeStyle(style, {
        ...sx,
        color: textColor,
        fontWeight,
        marginBottom: mb !== undefined ? (typeof mb === 'number' ? `${mb}rem` : mb) : undefined,
      })}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Card({ children, className = '', style, sx, variant, ...props }: WithSx & { variant?: string }) {
  const outlined = variant === 'outlined';
  return (
    <div className={`card ${outlined ? 'border' : ''} ${className}`.trim()} style={mergeStyle(style, sx)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '', style, sx, ...props }: WithSx) {
  return (
    <div className={`card-body ${className}`.trim()} style={mergeStyle(style, sx)} {...props}>
      {children}
    </div>
  );
}

export function Paper({ children, className = '', style, sx, ...props }: WithSx) {
  return (
    <div className={`card bg-body ${className}`.trim()} style={mergeStyle(style, sx)} {...props}>
      <div className="card-body">{children}</div>
    </div>
  );
}

export function Button({
  children,
  className = '',
  sx,
  style,
  variant = 'contained',
  color = 'primary',
  size,
  component: Component = 'button',
  ...props
}: WithSx & ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; color?: string; size?: 'small' | 'medium' | 'large'; component?: any }) {
  const sizeClass = size === 'small' ? 'btn-sm' : size === 'large' ? 'btn-lg' : '';
  const classes = `${variantClassName(variant, color)} ${sizeClass} ${className}`.trim();
  return (
    <Component className={classes} style={mergeStyle(style, sx)} {...props}>
      {children}
    </Component>
  );
}

export function Alert({ children, className = '', sx, style, severity = 'info', ...props }: WithSx & { severity?: string }) {
  const color = severity === 'error' ? 'danger' : severity === 'success' ? 'success' : severity === 'warning' ? 'warning' : 'info';
  return (
    <div className={`alert alert-${color} ${className}`.trim()} role="alert" style={mergeStyle(style, sx)} {...props}>
      {children}
    </div>
  );
}

export function Chip({ children, className = '', sx, style, label, color = 'default', variant, ...props }: WithSx & { label?: ReactNode; color?: string; variant?: string }) {
  const colorClass = color === 'default' ? 'secondary' : mapButtonColor(color);
  const classes = `badge ${variant === 'outlined' ? `text-bg-${colorClass}` : `bg-${colorClass}`} ${className}`.trim();
  return (
    <span className={classes} style={mergeStyle(style, sx)} {...props}>
      {label ?? children}
    </span>
  );
}

export function TextField({
  label,
  helperText,
  error,
  fullWidth,
  size,
  select,
  multiline,
  rows,
  className = '',
  sx,
  style,
  component: Component = 'input',
  children,
  ...props
}: WithSx & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  select?: boolean;
  multiline?: boolean;
  rows?: number;
  component?: any;
}) {
  const inputClass = `form-control ${size === 'small' ? 'form-control-sm' : ''} ${error ? 'is-invalid' : ''} ${className}`.trim();
  const selectClass = `form-select ${size === 'small' ? 'form-select-sm' : ''} ${error ? 'is-invalid' : ''} ${className}`.trim();

  const field = select ? (
    <select className={selectClass} style={mergeStyle(style, sx)} {...props}>
      {children}
    </select>
  ) : multiline ? (
    <textarea className={inputClass} rows={rows || 3} style={mergeStyle(style, sx)} {...props} />
  ) : (
    <Component className={inputClass} style={mergeStyle(style, sx)} {...props} />
  );

  return (
    <div className={fullWidth ? 'w-100' : undefined}>
      {label ? <label className="form-label">{label}</label> : null}
      {field}
      {helperText ? <div className={`form-text ${error ? 'text-danger' : ''}`.trim()}>{helperText}</div> : null}
    </div>
  );
}

type SelectProps = WithSx & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  size?: 'small' | 'medium' | 'large';
};

export function Select({ children, className = '', sx, style, size: selectSize, ...props }: SelectProps) {
  const sizeClass = selectSize === 'small' ? 'form-select-sm' : '';
  return (
    <select className={`form-select ${sizeClass} ${className}`.trim()} style={mergeStyle(style, sx)} {...props}>
      {children}
    </select>
  );
}

export function MenuItem({ children, value, className = '', sx, style, ...props }: WithSx & { value?: string | number }) {
  return (
    <option value={value} className={className} style={mergeStyle(style, sx)} {...props}>
      {children}
    </option>
  );
}

export function Table({ children, className = '', sx, style, stickyHeader, ...props }: WithSx & { stickyHeader?: boolean }) {
  const classes = `table ${className}`.trim();
  return (
    <table className={classes} style={mergeStyle(style, sx)} {...props}>
      {Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return cloneElement(child, { stickyHeader: child.props.stickyHeader ?? stickyHeader });
      })}
    </table>
  );
}

export function TableHead({ children, className = '', sx, style, stickyHeader, ...props }: WithSx & { stickyHeader?: boolean }) {
  return (
    <thead
      className={className}
      style={mergeStyle(style, {
        ...sx,
        position: stickyHeader ? 'sticky' : undefined,
        top: stickyHeader ? 0 : undefined,
        backgroundColor: stickyHeader ? 'white' : undefined,
        zIndex: stickyHeader ? 1 : undefined,
      })}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '', sx, style, ...props }: WithSx) {
  return (
    <tbody className={className} style={mergeStyle(style, sx)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '', sx, style, ...props }: WithSx) {
  return (
    <tr className={className} style={mergeStyle(style, sx)} {...props}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '', sx, style, component, ...props }: WithSx & { component?: 'th' | 'td' }) {
  const Tag = component === 'th' ? 'th' : 'td';
  return (
    <Tag className={className} style={mergeStyle(style, sx)} {...props}>
      {children}
    </Tag>
  );
}

export function TablePagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50],
  className = '',
  style,
  sx,
  ...props
}: WithSx & {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (_: any, page: number) => void;
  onRowsPerPageChange: React.ChangeEventHandler<HTMLSelectElement>;
  rowsPerPageOptions?: number[];
}) {
  const pageCount = Math.max(1, Math.ceil(count / rowsPerPage));

  return (
    <div className={`d-flex justify-content-between align-items-center ${className}`.trim()} style={mergeStyle(style, sx)} {...props}>
      <div>
        Showing {Math.min(count, page * rowsPerPage + 1)} - {Math.min(count, (page + 1) * rowsPerPage)} of {count}
      </div>
      <div className="d-flex gap-2 align-items-center">
        <select className="form-select form-select-sm w-auto" value={rowsPerPage} onChange={onRowsPerPageChange}>
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="btn-group btn-group-sm">
          <button type="button" className="btn btn-outline-secondary" disabled={page <= 0} onClick={(e) => onPageChange(e, page - 1)}>
            Prev
          </button>
          <button type="button" className="btn btn-outline-secondary" disabled={page >= pageCount - 1} onClick={(e) => onPageChange(e, page + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export function Avatar({
  src,
  children,
  alt,
  className = '',
  style,
  sx,
  ...props
}: WithSx & { src?: string; alt?: string }) {
  return (
    <div
      className={`rounded-circle bg-secondary text-white d-inline-flex justify-content-center align-items-center ${className}`.trim()}
      style={mergeStyle({ width: 32, height: 32, overflow: 'hidden', fontSize: '0.9rem' }, mergeStyle(style, sx))}
      {...props}
    >
      {src ? <img src={src} alt={alt} className="w-100 h-100" style={{ objectFit: 'cover' }} /> : children}
    </div>
  );
}

export function Skeleton({ variant, height, width, className = '', style, sx, ...props }: WithSx & { variant?: string; height?: number; width?: string | number }) {
  return (
    <div
      className={`placeholder ${className}`.trim()}
      style={mergeStyle(
        {
          display: 'block',
          height,
          width,
          minHeight: height ? undefined : 1,
          backgroundColor: '#e9ecef',
          borderRadius: variant === 'rounded' ? '0.5rem' : '0.25rem',
        },
        mergeStyle(style, sx)
      )}
      {...props}
    />
  );
}

export function Grid2({
  children,
  container,
  size,
  xs,
  sm,
  md,
  lg,
  xl,
  spacing,
  className = '',
  style,
  sx,
  ...props
}: WithSx & {
  container?: boolean;
  size?: SizeMap | number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  spacing?: number;
}) {
  const classes: string[] = [className];
  if (container) classes.push('row');
  const addCol = (breakpoint: string, value?: number) => {
    if (value !== undefined) {
      if (breakpoint) {
        classes.push(`col-${breakpoint}-${value}`);
      } else {
        classes.push(`col-${value}`);
      }
    }
  };
  if (typeof size === 'number') {
    addCol('', size);
  } else if (typeof size === 'object' && size !== null) {
    addCol('', size.xs);
    addCol('sm', size.sm);
    addCol('md', size.md);
    addCol('lg', size.lg);
    addCol('xl', size.xl);
  }
  addCol('', xs);
  addCol('sm', sm);
  addCol('md', md);
  addCol('lg', lg);
  addCol('xl', xl);
  if (spacing !== undefined && container) classes.push(`g-${spacing}`);

  return (
    <div className={classes.filter(Boolean).join(' ').trim()} style={mergeStyle(style, sx)} {...props}>
      {children}
    </div>
  );
}

export function Link({
  children,
  component: Component = 'a',
  to,
  href,
  className = '',
  sx,
  style,
  ...props
}: WithSx & { component?: any; to?: string; href?: string }) {
  const target = href ?? to;
  if (Component === 'a') {
    return (
      <a className={className} href={target} style={mergeStyle(style, sx)} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Component to={to} href={target} className={className} style={mergeStyle(style, sx)} {...props}>
      {children}
    </Component>
  );
}

export function List({ children, className = '', sx, style, ...props }: WithSx) {
  return (
    <div className={`list-group ${className}`.trim()} style={mergeStyle(style, sx)} {...props}>
      {children}
    </div>
  );
}

export function ListItemButton({ children, component: Component = 'button', className = '', ...props }: WithSx & { component?: any }) {
  return (
    <Component className={`list-group-item list-group-item-action ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

export function ListItemIcon({ children, className = '', ...props }: WithSx) {
  return (
    <span className={`me-2 ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}

export function ListItemText({ primary, secondary, className = '', ...props }: WithSx & { primary?: ReactNode; secondary?: ReactNode }) {
  return (
    <div className={className} {...props}>
      {primary ? <div>{primary}</div> : null}
      {secondary ? <small className="text-muted">{secondary}</small> : null}
    </div>
  );
}

export function Divider({ className = '', sx, style, ...props }: WithSx) {
  return <hr className={className} style={mergeStyle(style, sx)} {...props} />;
}

export function Dialog({ children, open, className = '', sx, style, ...props }: WithSx & { open?: boolean }) {
  if (!open) return null;
  return (
    <div className={`modal d-block ${className}`.trim()} style={mergeStyle({ backgroundColor: 'rgba(0,0,0,.4)', padding: '1.5rem' }, mergeStyle(style, sx))} {...props}>
      <div className="modal-dialog">
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

export function DialogTitle({ children, className = '', sx, style, ...props }: WithSx) {
  return (
    <div className={`modal-header ${className}`.trim()} style={mergeStyle(style, sx)} {...props}>
      <h5 className="modal-title">{children}</h5>
    </div>
  );
}

export function DialogContent({ children, className = '', sx, style, ...props }: WithSx) {
  return (
    <div className={`modal-body ${className}`.trim()} style={mergeStyle(style, sx)} {...props}>
      {children}
    </div>
  );
}

export function DialogActions({ children, className = '', sx, style, ...props }: WithSx) {
  return (
    <div className={`modal-footer ${className}`.trim()} style={mergeStyle(style, sx)} {...props}>
      {children}
    </div>
  );
}

export function Tab({ children, label, selected, onChange, className = '', ...props }: WithSx & { label?: ReactNode; selected?: boolean; onChange?: React.MouseEventHandler<HTMLButtonElement> }) {
  return (
    <li className="nav-item" {...props}>
      <button type="button" className={`nav-link ${selected ? 'active' : ''} ${className}`.trim()} onClick={onChange}>
        {label ?? children}
      </button>
    </li>
  );
}

export function Tabs({ children, value, onChange, className = '', sx, style, ...props }: WithSx & { value?: number; onChange?: (_: any, value: number) => void }) {
  return (
    <ul className={`nav nav-tabs ${className}`.trim()} style={mergeStyle(style, sx)} {...props}>
      {Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return cloneElement(child as ReactElement<any>, {
          selected: value === index,
          onChange: (event: React.MouseEvent<HTMLButtonElement>) => onChange?.(event, index),
        });
      })}
    </ul>
  );
}

export function StepLabel({ children, active, completed, className = '', sx, style, ...props }: WithSx & { active?: boolean; completed?: boolean }) {
  return (
    <div className={`d-flex align-items-center ${className}`.trim()} style={mergeStyle(style, sx)} {...props}>
      <span className={`badge me-2 ${completed ? 'bg-success' : active ? 'bg-primary' : 'bg-secondary'}`.trim()}>{completed ? '✓' : '●'}</span>
      <span>{children}</span>
    </div>
  );
}

export function Step({ children, active, completed, className = '', sx, style, ...props }: WithSx & { active?: boolean; completed?: boolean }) {
  return (
    <div className={`step ${className}`.trim()} style={mergeStyle(style, sx)} {...props}>
      {Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return cloneElement(child as ReactElement<any>, { active, completed });
      })}
    </div>
  );
}

export function Stepper({ children, activeStep = 0, className = '', sx, style, ...props }: WithSx & { activeStep?: number }) {
  return (
    <div className={`d-flex flex-column gap-2 ${className}`.trim()} style={mergeStyle(style, sx)} {...props}>
      {Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return cloneElement(child as ReactElement<any>, {
          active: index === activeStep,
          completed: index < activeStep,
        });
      })}
    </div>
  );
}
