import { FC } from 'react';
import { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './PDFReader.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Button } from 'components/Button/Button.styled';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ContentLoader } from 'components/Loaders';

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/'
};

interface PDFReaderProps {
  url: string;
}

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url
// ).toString();

// testing if switching to unpkg.com fixes the issue,
// otherwise will need to copy worker to project's output folder
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFReader = ({ url }: PDFReaderProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayMode, setDisplayMode] = useState<'single' | 'all'>('single');

  function onDocumentLoadSuccess({
    numPages: nextNumPages
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  function goToNextPage(): void {
    if (numPages !== undefined && currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  function goToPreviousPage(): void {
    if (numPages !== undefined && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function handleDisplayModeChange(
    event: React.MouseEvent<HTMLElement>,
    newDisplayMode: 'single' | 'all' | null
  ) {
    if (newDisplayMode !== null && newDisplayMode !== displayMode) {
      setDisplayMode(newDisplayMode);
    }
  }

  return (
    <div className="pdfReader">
      <div className="pdfControls">
        {/* <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous Page
        </Button>
        <Button onClick={goToNextPage} disabled={currentPage === numPages}>
          Next Page
        </Button> */}
        <ToggleButtonGroup
          value={displayMode}
          exclusive
          onChange={handleDisplayModeChange}
          aria-label="Display mode"
        >
          <ToggleButton
            value="single"
            aria-label="Single page"
            sx={{
              color: 'primary.main',
              textTransform: 'none',
              borderRadius: '4px',
              padding: '8px',
              minWidth: 'auto'
            }}
          >
            Single
          </ToggleButton>
          <ToggleButton
            value="all"
            aria-label="All pages"
            sx={{
              color: 'primary.main',
              textTransform: 'none',
              borderRadius: '4px',
              padding: '8px',
              minWidth: 'auto'
            }}
          >
            All Pages
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="pdfDocument">
        {displayMode === 'single' && (
          <>
            <IconButton
              aria-label="Previous Page"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              sx={{ color: 'primary.main' }}
            >
              <KeyboardArrowLeft />
            </IconButton>
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
              <Page className="pdfPage" pageNumber={currentPage} height={800} />
            </Document>
            <IconButton
              aria-label="Next Page"
              onClick={goToNextPage}
              disabled={currentPage === numPages}
              sx={{ color: 'primary.main' }}
            >
              <KeyboardArrowRight />
            </IconButton>
          </>
        )}
        {displayMode === 'all' && (
          <Document
            file={url}
            loading={<ContentLoader size={10} />}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                className="pdfPage"
                pageNumber={index + 1}
              />
            ))}
          </Document>
        )}
      </div>
    </div>
  );
};

export default PDFReader;
