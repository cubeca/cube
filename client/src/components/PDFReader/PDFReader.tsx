import { FC } from 'react';
import { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './PDFReader.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};
interface PDFReaderProps {
  url: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const PDFReader: FC<PDFReaderProps> = ({ url }) => {
  const [numPages, setNumPages] = useState<number>();
  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }
  return (
    <Document className="pdfDocument" file={url} onLoadSuccess={onDocumentLoadSuccess} options={options}>
    {Array.from(new Array(numPages), (el, index) => (
      <Page className="pdfPage" key={`page_${index + 1}`} pageNumber={index + 1} />
    ))}
  </Document>
  );
};

export default PDFReader;
