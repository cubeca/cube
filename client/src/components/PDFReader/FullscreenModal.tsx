import { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import FocusTrap from 'focus-trap-react';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Close
} from '@mui/icons-material';
import { Box } from '@mui/material';
import * as s from './PDFReader.styled';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
    <FocusTrap>
      <s.FullscreenModalContainer onClick={handleClose}>
        <s.StyledAbsoluteIconButton
          aria-label="Close"
          onClick={handleClose}
          sx={{
            color: 'primary.main'
          }}
        >
          <Close />
        </s.StyledAbsoluteIconButton>

        <s.ModalPageContainer>
          <s.ArrowIconButton
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
          </s.ArrowIconButton>
          <Box
            onClick={(event) => event.stopPropagation()}
            tabIndex={0} // Make the PDF container focusable
            aria-label={`PDF document, page ${currentPage} of ${numPages}`}
          >
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={currentPage}
                width={screenWidth < 1000 ? screenWidth : undefined}
                height={window.innerHeight}
                loading={null}
              />
            </Document>
          </Box>
          <s.ArrowIconButton
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
          </s.ArrowIconButton>
        </s.ModalPageContainer>
      </s.FullscreenModalContainer>
    </FocusTrap>
  );
};

export default PDFModal;
