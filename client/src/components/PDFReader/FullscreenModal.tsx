import { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Close
} from '@mui/icons-material';
import { IconButton, Box } from '@mui/material';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFModalProps {
  url: string;
  onClose: (selectedPage: number) => void;
  displayMode: 'single' | 'all';
  pageToOpen: number;
  setPageToReturnTo: (page: number) => void;
}

const PDFModal = ({
  url,
  onClose,
  displayMode,
  pageToOpen,
  setPageToReturnTo
}: PDFModalProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(pageToOpen);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  function onDocumentLoadSuccess({
    numPages: nextNumPages
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  function goToNextPage(event: React.MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    if (numPages !== undefined && currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  function goToPreviousPage(event: React.MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    if (numPages !== undefined && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function handleClose(selectedPage: any): void {
    onClose(currentPage);
    setPageToReturnTo(currentPage);
  }

  return (
    <Box
      className="pdf-modal"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}
      onClick={handleClose}
    >
      <IconButton
        aria-label="Close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: 'primary.main'
        }}
      >
        <Close />
      </IconButton>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginBottom: '20px'
        }}
      >
        <IconButton
          aria-label="Previous Page"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          sx={{
            color: 'primary.main',
            display: 'block',
            height: '100px',
            '& svg': {
              fontSize: '4rem'
            }
          }}
        >
          <KeyboardArrowLeft />
        </IconButton>
        <Box onClick={(event) => event.stopPropagation()}>
          <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              pageNumber={currentPage}
              width={screenWidth < 1200 ? screenWidth : undefined}
              height={window.innerHeight}
              loading={null}
            />
          </Document>
        </Box>
        <IconButton
          aria-label="Next Page"
          onClick={goToNextPage}
          disabled={currentPage === numPages}
          sx={{
            color: 'primary.main',
            display: 'block',
            height: '100px',
            '& svg': {
              fontSize: '4rem'
            }
          }}
        >
          <KeyboardArrowRight />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PDFModal;
