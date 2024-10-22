import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function downloadPDF(
  columns: string[],
  rows: any[],
  fileName: string,
  title: string
) {
  const doc = new jsPDF();

  // Add a title
  doc.setFontSize(12);
  doc.text(title, 14, 16);

  autoTable(doc, {
    head: [columns],
    body: rows,
    styles: {
      fontSize: 10, // Set default font size
      cellPadding: 4, // Padding for cells
      halign: "center", // Horizontal alignment
      valign: "middle", // Vertical alignment
      lineWidth: 0.1, // Width of the border lines
      lineColor: [240, 240, 240], // Line color for borders (black)
    },
    // Customize header styles
    headStyles: {
      fillColor: [240, 240, 240], // Light green background color for headers
      textColor: [0, 0, 0], // Black text color for headers
    },
    columnStyles: {
      0: { halign: "left" }, // Align first column to the left
      3: { halign: "left" }, // Align email column to the right
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255], // Light gray for alternate rows
    },
    margin: { top: 30 }, // Top margin
  });

  doc.save(fileName);
}
