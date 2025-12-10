import React from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// --- Button ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// --- Input ---
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// --- Label ---
export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";

// --- Card ---
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// --- Badge ---
export const Badge = ({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "outline" | "accent" }) => {
  return (
    <div className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      {
        "border-transparent bg-primary text-primary-foreground hover:bg-primary/80": variant === "default",
        "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
        "text-foreground": variant === "outline",
        "border-transparent bg-construction text-white hover:bg-construction/90": variant === "accent",
      },
      className
    )} {...props} />
  );
};

// --- Slider ---
interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max: number;
  step: number;
  className?: string;
}
export const Slider: React.FC<SliderProps> = ({ value, onValueChange, max, step, className }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([parseFloat(e.target.value)]);
  };

  return (
    <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-slate-900"
      />
    </div>
  );
};

// --- Switch ---
interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}
export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-slate-900" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
};

// --- Accordion ---
interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}
export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border-b">
      <button
        onClick={onToggle}
        className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline w-full text-left"
      >
        {title}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 shrink-0 transition-transform duration-200"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden text-sm"
          >
            <div className="pb-4 pt-0 text-slate-600">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Dialog/Modal ---
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'gallery';
}
export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children, variant = 'default' }) => {
  // Block body scroll and blur root when modal is open
  React.useEffect(() => {
    if (isOpen) {
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';

      // Blur and disable root element
      const root = document.getElementById('root');
      if (root) {
        root.style.filter = 'blur(3px)';
        root.style.pointerEvents = 'none';
      }
    } else {
      // Restore everything
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      const root = document.getElementById('root');
      if (root) {
        root.style.filter = '';
        root.style.pointerEvents = '';
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      const root = document.getElementById('root');
      if (root) {
        root.style.filter = '';
        root.style.pointerEvents = '';
      }
    };
  }, [isOpen]);

  // Render modal outside root using Portal
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay - blocks all interactions with background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[99998] bg-black/80 backdrop-blur-sm"
            style={{ userSelect: 'none' }}
          />
          {/* Modal content - centered with highest z-index */}
          <div className="fixed inset-0 z-[99999] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "relative w-full rounded-lg border shadow-2xl",
                  variant === 'gallery'
                    ? "max-w-6xl p-0 bg-transparent border-none"
                    : "max-w-lg p-6 bg-white"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {children}
                {variant !== 'gallery' && (
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

// --- Sheet (Mobile Menu) ---
interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
export const Sheet: React.FC<SheetProps> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
           <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm"
          >
             <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
