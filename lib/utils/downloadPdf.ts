import { jsPDF } from "jspdf";
import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function downloadPDF(
  columns: string[],
  rows: any[],
  fileName: string,
  title: string
) {
  const doc = new jsPDF();

  doc.setFontSize(12);
  doc.text(title, 14, 16);

  doc.autoTable({
    head: [columns],
    body: rows,
    styles: {
      fontSize: 10,
      cellPadding: 4,
      halign: "center",
      valign: "middle",
      lineWidth: 0.1,
      lineColor: [240, 240, 240],
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { halign: "left" },
      3: { halign: "left" },
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
    margin: { top: 30 },
  });

  doc.save(fileName);
}
