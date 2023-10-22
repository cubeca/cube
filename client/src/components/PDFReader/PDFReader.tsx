import { FC, useEffect } from 'react';
import { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Button } from 'components/Button/Button.styled';
import {
  Fullscreen,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { ContentLoader } from 'components/Loaders';
import Grid from '@mui/system/Unstable_Grid';
import PDFModal from './FullscreenModal';

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/'
};

interface PDFReaderProps {
  url: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
    if (newDisplayMode !== null && newDisplayMode !== displayMode) {
      setDisplayMode(newDisplayMode);
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: '#1A1919',
        padding: { xs: '0', md: '30px' },
        paddingTop: { xs: '12px', md: '30px' },
        position: 'relative'
      }}
    >
      <Grid>
        <Grid xs={12} sm={12} md={12} lg={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: { xs: '12px', md: '30px' }
            }}
          >
            <ToggleButtonGroup
              value={displayMode}
              exclusive
              onChange={handleDisplayModeChange}
              aria-label="Display mode"
              sx={{
                '& .MuiToggleButton-root.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'black'
                },
                '& .MuiToggleButton-root:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText'
                }
              }}
            >
              <ToggleButton
                value="single"
                aria-label="Single page"
                sx={{
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
                  textTransform: 'none',
                  borderRadius: '4px',
                  padding: '8px',
                  minWidth: 'auto'
                }}
              >
                All Pages
              </ToggleButton>
            </ToggleButtonGroup>
            <IconButton
              aria-label="Fullscreen"
              onClick={handleFullscreenClick}
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                color: 'primary.main',
                display: { xs: 'none', sm: 'none', lg: 'flex' },
                '& svg': {
                  fontSize: '2rem'
                }
              }}
            >
              <Fullscreen />
            </IconButton>
          </Box>
          <Grid>
            {displayMode === 'single' && (
              <>
                <Box
                  sx={{
                    height: { md: '85vh', lg: 'calc(85vh)' },
                    maxHeight: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <IconButton
                    aria-label="Previous Page"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    sx={{
                      color: 'primary.main',
                      display: { xs: 'none', sm: 'none', md: 'block' },
                      height: '100px',
                      '& svg': {
                        fontSize: '4rem'
                      }
                    }}
                  >
                    <KeyboardArrowLeft />
                  </IconButton>

                  <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page
                      pageNumber={currentPage}
                      width={screenWidth < 1000 ? screenWidth : undefined}
                      loading={null}
                    />
                  </Document>

                  <Box>
                    <IconButton
                      aria-label="Next Page"
                      onClick={goToNextPage}
                      disabled={currentPage === numPages}
                      sx={{
                        color: 'primary.main',
                        display: { xs: 'none', md: 'block' },
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
                <Box
                  sx={{
                    display: { xs: 'flex', sm: 'flex', md: 'none' },
                    width: '100%',
                    height: '90px',
                    justifyContent: 'space-evenly',
                    alignItems: 'center'
                  }}
                >
                  <IconButton
                    aria-label="Previous Page"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    sx={{
                      color: 'primary.main',
                      height: '80px',
                      '& svg': {
                        fontSize: '3rem'
                      }
                    }}
                  >
                    <KeyboardArrowLeft />
                  </IconButton>

                  <IconButton
                    aria-label="Next Page"
                    onClick={goToNextPage}
                    disabled={currentPage === numPages}
                    sx={{
                      color: 'primary.main',
                      height: '80px',
                      '& svg': {
                        fontSize: '3rem'
                      }
                    }}
                  >
                    <KeyboardArrowRight />
                  </IconButton>
                </Box>
              </>
            )}
            {displayMode === 'all' && (
              <Box
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
                    <Box key={`page_${index + 1}`} sx={{ marginBottom: 1 }}>
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={screenWidth < 1000 ? screenWidth : undefined}
                      />
                    </Box>
                  ))}
                </Document>
              </Box>
            )}
          </Grid>
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
    </Box>
  );
};

export default PDFReader;
