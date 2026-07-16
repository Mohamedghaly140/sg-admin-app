type ChartDataTableProps = {
  /** Describes the chart; announced as the table's caption to screen readers. */
  caption: string;
  /** Header cells; the first names the category / row-header column. */
  columns: string[];
  /** One array of cells per row, aligned to `columns` (the first cell is the row header). */
  rows: (string | number)[][];
};

/**
 * Visually-hidden data table paired with a recharts chart so screen-reader
 * users get the underlying numbers (recharts `accessibilityLayer` only exposes
 * keyboard tooltip navigation). Render it inside the chart's `CardContent`
 * alongside the `ChartContainer` — never `aria-hidden` the chart to compensate,
 * as its SVG is keyboard-focusable and both are meant to coexist.
 */
export function ChartDataTable({ caption, columns, rows }: ChartDataTableProps) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={String(row[0])}>
            {row.map((cell, index) =>
              index === 0 ? (
                <th key={columns[index]} scope="row">
                  {cell}
                </th>
              ) : (
                <td key={columns[index]}>{cell}</td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
