export default function Button({
  variant = "primary",
  size = "md", // NEW
  className = "",
  as: As = "button",
  ...props
}) {
  const styles =
    {
      primary: "btn-primary",
      dark: "btn-dark",
      ghost: "btn-ghost",
      danger: "btn-danger",
    }[variant] || "btn-primary";

  const sizeCls = size === "sm" ? "btn-sm" : "btn";

  return <As className={`${styles} ${sizeCls} ${className}`} {...props} />;
}
