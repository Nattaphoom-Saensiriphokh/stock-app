export function isUniqueViolation(e: any): boolean {
  const code = e?.code ?? e?.cause?.code;
  return (
    code === "P2002" ||
    code === "23505" || // Postgres unique_violation
    e?.cause?.kind === "UniqueConstraintViolation" ||
    e?.meta?.driverAdapterError?.cause?.kind === "UniqueConstraintViolation" ||
    /unique constraint|duplicate key/i.test(String(e?.message ?? ""))
  );
}