import styles from "./Loading.module.css";

type LoadingProps = {
  label?: string;
  inline?: boolean;
  className?: string;
};

export function Loading({
  label = "Loading",
  inline = false,
  className = "",
}: LoadingProps) {
  const classes = [
    inline ? styles.inlineLoading : styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const indicator = (
    <>
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.visuallyHidden}>{label}</span>
    </>
  );

  return inline ? (
    <span className={classes} role="status" aria-label={label}>
      {indicator}
    </span>
  ) : (
    <div className={classes} role="status" aria-label={label}>
      {indicator}
    </div>
  );
}