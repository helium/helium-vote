import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const pillVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground/80 border-foreground/20",
        success:
          "bg-success text-success-foreground border-success-foreground/20",
        warning:
          "bg-warning text-warning-foreground border-warning-foreground/20",
        info: "bg-info text-info-foreground border-info-foreground/20",
        purple: "bg-purple text-purple-foreground border-purple-foreground/20",
        pink: "bg-pink text-pink-foreground border-pink-foreground/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface PillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pillVariants> {}

function Pill({ className, variant, ...props }: PillProps) {
  return (
    <div className="flex flex-row items-center">
      <div className={cn(pillVariants({ variant }), className)} {...props} />
    </div>
  );
}

export { Pill, pillVariants };
