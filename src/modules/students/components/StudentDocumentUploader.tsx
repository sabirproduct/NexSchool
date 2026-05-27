export function StudentDocumentUploader() {
  return (
    <div className="mb-3">
      <div className="mb-2"><strong>Document Upload</strong> <span className="text-muted">(Firebase Storage placeholder)</span></div>
      <button type="button" className="btn btn-outline-secondary btn-sm" aria-label="Upload documents">
        Upload documents
        <input type="file" hidden multiple />
      </button>
    </div>
  );
}
