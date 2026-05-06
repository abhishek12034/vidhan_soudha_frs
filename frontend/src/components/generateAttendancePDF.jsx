import jsPDF from "jspdf";

export async function generateAttendancePDF(groupedData, selectedDate, fileName = "attendance.pdf") {
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const usableWidth = pageWidth - margin * 2;

  // Adjust column widths for only Sl No, Name, Duration
  const colWidths = {
    slNo: usableWidth * 0.1,
    name: usableWidth * 0.6,
    duration: usableWidth * 0.3,
  };

  const startX = margin;
  let currentY = margin + 30;
  const rowHeight = 25;
  const headerHeight = 25;

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica");
  doc.text("Vidhan Soudha Attendance Sheet", pageWidth / 2, currentY, { align: "center" });

  currentY += 25;

  // Subheading with selected date
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const dateText = selectedDate
    ? `Attendance Report for ${selectedDate}`
    : "Attendance Report (Date not selected)";
  doc.text(dateText, pageWidth / 2, currentY, { align: "center" });

  currentY += 35;

  function drawTableHeader() {
    doc.setFontSize(12);
    doc.setFont("helvetica");
    doc.setFillColor(230, 230, 230);

    doc.rect(startX, currentY, usableWidth, headerHeight, "F");

    let x = startX;
    doc.rect(x, currentY, colWidths.slNo, headerHeight); x += colWidths.slNo;
    doc.rect(x, currentY, colWidths.name, headerHeight); x += colWidths.name;
    doc.rect(x, currentY, colWidths.duration, headerHeight);

    const headerY = currentY + 17;
    x = startX;
    doc.setTextColor(0);
    doc.text("Sl No", x + 5, headerY); x += colWidths.slNo;
    doc.text("Name", x + 5, headerY); x += colWidths.name;
    doc.text("Duration", x + 5, headerY);
  }

  for (const group of groupedData) {
    const requiredSpace = headerHeight + rowHeight + 30;
    if (currentY + requiredSpace > pageHeight - margin) {
      doc.addPage();
      currentY = margin + 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica");
    doc.setTextColor(0);
    doc.text(group.date, pageWidth / 2, currentY, { align: "center" });
    currentY += 25;

    drawTableHeader();
    currentY += headerHeight;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);

    let slNoCounter = 1;

    for (const person of group.records) {
      if (currentY + rowHeight > pageHeight - margin) {
        doc.addPage();
        currentY = margin + 20;

        doc.setFontSize(14);
        doc.setFont("helvetica");
        doc.setTextColor(0);
        doc.text(group.date, pageWidth / 2, currentY, { align: "center" });
        currentY += 25;

        drawTableHeader();
        currentY += headerHeight;
      }

      let x = startX;
      doc.setDrawColor(200);
      doc.setLineWidth(0.5);
      doc.rect(x, currentY, colWidths.slNo, rowHeight); x += colWidths.slNo;
      doc.rect(x, currentY, colWidths.name, rowHeight); x += colWidths.name;
      doc.rect(x, currentY, colWidths.duration, rowHeight);

      const textY = currentY + 17;
      x = startX;
      doc.text(`${slNoCounter}`, x + 5, textY); x += colWidths.slNo;
      doc.text(person.name || "N/A", x + 5, textY); x += colWidths.name;
      doc.text(person.totalTime || "00:00:00", x + 5, textY);

      currentY += rowHeight;
      slNoCounter += 1;
    }

    currentY += 20;
  }

  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
}
