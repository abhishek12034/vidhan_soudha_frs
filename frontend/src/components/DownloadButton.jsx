import { useRef, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {generateAttendancePDF} from "./generateAttendancePDF";
import axios from "axios";
import PDFPreviewModal from "./PDFPreviewModal";

function DownloadButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pdfUrl, setPDFUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setError(null);
  }, [startDate, endDate]);

  const getDateRangeArray = (start, end) => {
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setError("Start date cannot be after end date.");
      return;
    }

    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      setError("Date range should not be more than 7 days.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dateRange = getDateRangeArray(start, end);
      const groupedData = [];

      for (const date of dateRange) {
        const startStr = date.toISOString().split("T")[0];
        const url = `http://localhost:8000/api/v1/report?start_date=${startStr}&end_date=${startStr}`;

        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = response.data || [];

        const transformed = data.map((item, index) => ({
          slNo: index + 1,
          name: item.fullName || "N/A",
          entryCount: item.entryCount || 0,
          exitCount: item.exitCount || 0,
          totalTime: item.totalTimeInRoomFormatted || "00:00:00",
        }));

        groupedData.push({
          date: date.toDateString(),
          records: transformed,
        });
      }

      const blobUrl = await generateAttendancePDF(groupedData, `${startDate} to ${endDate}`);
      setPDFUrl(blobUrl);
      setShowPreview(true);
      setShowModal(false);
      setStartDate("");
      setEndDate("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        style={{
          backgroundColor: "#11AADF",
          color: "white",
          fontWeight: "600",
          padding: "1rem 5rem 1.5rem",
          margin: "1rem 0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onClick={() => setShowModal(true)}
      >
        Attendance Report
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Date Range</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group style={{ marginBottom: "1rem" }}>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              ref={startDateRef}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={today}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              ref={endDateRef}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              max={today}
            />
          </Form.Group>

          {error && (
            <div style={{ marginTop: "1rem", color: "red", fontWeight: "600" }}>
              {error}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#11AADF", color: "white", fontWeight: "600" }}
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? "Generating..." : "Preview"}
          </Button>
        </Modal.Footer>
      </Modal>

      <PDFPreviewModal
        show={showPreview}
        onClose={() => setShowPreview(false)}
        pdfUrl={pdfUrl}
      />
    </>
  );
}

export default DownloadButton;
