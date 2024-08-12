/**
 * `PDFReader` is a component designed to render PDF documents.
 * It utilizes the `pdfjs-dist` library to load and display PDF files. The component supports basic functionalities
 * such as navigating between pages, toggling fullscreen mode, and dynamically adjusting to screen width changes.
 * It also includes a custom fullscreen modal for an enhanced viewing experience in fullscreen mode.
 * The component allows for displaying one page at a time or all pages simultaneously, controlled by the `displayMode` state.
 *
 * @param {string} url The URL of the PDF document to be displayed.
 */

import { useEffect } from 'react';
import { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import {
  Fullscreen,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@mui/icons-material';

import { ContentLoader } from 'components/Loaders';
import Grid from '@mui/system/Unstable_Grid';
import PDFModal from './FullscreenModal';
import * as s from './PDFReader.styled';

interface PDFReaderProps {
  url: string;
}
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const PDFReader = ({ url }: PDFReaderProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayMode, setDisplayMode] = useState<'single' | 'all'>('single');
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pageToReturnTo, setPageToReturnTo] = useState<number>(1);

  function handleFullscreenClick(): void {
    setIsFullscreen(true);
    if (displayMode === 'single') {
      setCurrentPage(currentPage);
    } else if (displayMode === 'all') {
      setCurrentPage(1);
    }
  }

  function handleCloseModal(): void {
    setIsFullscreen(false);
    setCurrentPage(currentPage);
  }
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(pageToReturnTo);
  }, [pageToReturnTo]);

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
    console.log('clicked');
    if (newDisplayMode !== null && newDisplayMode !== displayMode) {
      setDisplayMode(newDisplayMode);
    }
  }

  return (
    <s.PDFReaderContainer>
      <Grid>
        <s.ButtonContainer>
          <s.StyledToggleButtonGroup
            value={displayMode}
            exclusive
            onChange={handleDisplayModeChange}
            aria-label="Display mode"
          >
            <s.StyledToggleButton value="single" aria-label="Single page">
              Single
            </s.StyledToggleButton>
            <s.StyledToggleButton value="all" aria-label="All pages">
              All Pages
            </s.StyledToggleButton>
          </s.StyledToggleButtonGroup>
          <s.StyledAbsoluteIconButton
            aria-label="Fullscreen"
            onClick={handleFullscreenClick}
          >
            <Fullscreen fontSize="large" />
          </s.StyledAbsoluteIconButton>
        </s.ButtonContainer>
        <Grid>
          {displayMode === 'single' && (
            <>
              <s.SinglePageContainer>
                <s.ArrowIconButton
                  sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}
                  aria-label="Previous Page"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <KeyboardArrowLeft />
                </s.ArrowIconButton>

                <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page
                    pageNumber={currentPage}
                    width={screenWidth < 1000 ? screenWidth : undefined}
                    loading={null}
                  />
                </Document>

                <s.ArrowIconButton
                  sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}
                  aria-label="Next Page"
                  onClick={goToNextPage}
                  disabled={currentPage === numPages}
                >
                  <KeyboardArrowRight />
                </s.ArrowIconButton>
              </s.SinglePageContainer>
              <s.MobileButtonContainer>
                <s.ArrowIconButton
                  aria-label="Previous Page"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  size="3rem"
                  height="80px"
                >
                  <KeyboardArrowLeft />
                </s.ArrowIconButton>

                <s.ArrowIconButton
                  aria-label="Next Page"
                  onClick={goToNextPage}
                  disabled={currentPage === numPages}
                  size="3rem"
                  height="80px"
                >
                  <KeyboardArrowRight />
                </s.ArrowIconButton>
              </s.MobileButtonContainer>
            </>
          )}
          {displayMode === 'all' && (
            <s.AllPagesContainer
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Document
                file={url}
                loading={<ContentLoader size={10} />}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <s.PageContainer key={`page_${index + 1}`}>
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={screenWidth < 1000 ? screenWidth : undefined}
                    />
                  </s.PageContainer>
                ))}
              </Document>
            </s.AllPagesContainer>
          )}
        </Grid>
      </Grid>
      {isFullscreen && (
        <PDFModal
          url={url}
          onClose={handleCloseModal}
          displayMode={displayMode}
          pageToOpen={currentPage}
          setPageToReturnTo={setPageToReturnTo}
        />
      )}
    </s.PDFReaderContainer>
  );
};

export default PDFReader;
