import type { HTMLAttributes, ReactNode } from "react";

type CardAs = "div" | "section" | "article" | "main";

export type CardProps = {
  as?: CardAs;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export function Card({ as = "div", className, children}: CardProps) {
  const Comp = as;

  return (
    <Comp className={["card-ui", className ?? ""].join(" ")}>
      {children}
    </Comp>
  );
}

export type CardStatProps = {
  as?: CardAs;
  title: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  valueClassName?: string;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

export function CardStat({
  as = "div",
  title,
  value,
  icon,
  className,
  iconClassName,
  titleClassName,
  valueClassName,
  ...props
}: CardStatProps) {
  return (
    <Card className={className ?? ""}>
      {icon ? (
        <div
          className={[
            "card-icon",
            iconClassName ?? "",
          ].join(" ")}
        >
          {icon}
        </div>
      ) : null}

      <dl className="min-w-0 flex flex-col gap-[10px]">
        <dt className={["text-sm font-[400] text-sm", titleClassName ?? ""].join(" ")}>
          {title}
        </dt>
        <dd
          className={[
            "font-[700] text-[24px]",
            valueClassName ?? "",
          ].join(" ")}
        >
          {value}
        </dd>
      </dl>
    </Card>
  );
}

export default Card;
