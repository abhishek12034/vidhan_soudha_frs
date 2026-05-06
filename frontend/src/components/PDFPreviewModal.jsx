import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function PDFPreviewModal({ show, onClose, pdfUrl, onExport }) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      size="xl"
      centered
      dialogClassName="custom-modal"
      contentClassName="custom-modal-content"
      backdrop="static"
    >
      <Modal.Header
        style={{
          backgroundColor: "#1e1e1e",
          color: "#eee",
          borderBottom: "1px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Modal.Title>Attendance Preview</Modal.Title>
        <div>
          <Button variant="secondary" onClick={onClose} style={{ marginRight: "8px" }}>
            Cancel
          </Button>
         <Button
  variant="primary"
  onClick={() => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Attendance.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }}
  disabled={!pdfUrl}
>
  Export PDF
</Button>

        </div>
      </Modal.Header>

      <Modal.Body
  style={{
    padding: 0,
    backgroundColor: "#1e1e1e",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  }}
>
  <div style={{ flex: 1, overflow: "hidden" }}>
    {pdfUrl ? (
      <iframe
        src={pdfUrl}
        title="PDF Preview"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    ) : (
      <div style={{ color: "#ccc", textAlign: "center", padding: "2rem" }}>
        Loading PDF...
      </div>
    )}
  </div>
</Modal.Body>


    <style>{`
  .modal-dialog.custom-modal {
    width: 60vw;
    max-width: none;
    margin: 0 auto;
  }
  .modal-content.custom-modal-content {
    height: 70vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`}</style>

    </Modal>
  );
}

export default PDFPreviewModal;
