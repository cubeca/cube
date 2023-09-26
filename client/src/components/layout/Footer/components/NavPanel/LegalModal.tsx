import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  IconButton,
  Typography
} from '@mui/material';

import * as s from './NavPanel.styled';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const LegalModal = () => {
  const { t } = useTranslation();
  const [legalDisplay, setLegalDisplay] = useState(false);

  return (
    <>
      <div>
        <BootstrapDialog
          onClose={() => setLegalDisplay(false)}
          aria-labelledby="customized-dialog-title"
          open={legalDisplay}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={() => setLegalDisplay(false)}
          >
            Terms of Service
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
              ac pellentesque velit. Ut ultricies dignissim sapien, nec vehicula
              urna tempus ac. Vivamus sit amet quam tortor. Proin non metus
              dictum, interdum quam quis, dapibus odio. Vivamus aliquet arcu eu
              pretium aliquet. Curabitur quam velit, interdum ac velit eget,
              fermentum cursus risus. Vestibulum faucibus, lorem in auctor
              sodales, nulla nulla pulvinar tellus, vel dignissim arcu nulla a
              odio. Proin sollicitudin consectetur metus, at tristique turpis
              congue ac. Quisque dapibus metus justo, nec maximus sem suscipit
              nec. Donec eleifend, ex eu commodo posuere, odio nisi dictum
              lectus, vitae bibendum sapien mi suscipit arcu. Pellentesque felis
              sem, rutrum ac urna ut, viverra maximus orci. Nunc eu lacus
              sodales, fermentum risus lacinia, consectetur tortor. Aliquam ut
              arcu justo. Aenean vitae sem ut ex faucibus aliquam tristique non
              lectus. Vivamus finibus auctor massa tristique aliquet. Cras
              vulputate, purus ut dapibus pulvinar, neque velit faucibus augue,
              id malesuada augue orci vitae ipsum. Duis eleifend nunc eu ipsum
              ultrices laoreet. Duis venenatis sed dui non consectetur. Etiam
              non consequat nibh. Aliquam vehicula magna ante. Etiam diam dui,
              ullamcorper accumsan rutrum at, lacinia a ipsum. Interdum et
              malesuada fames ac ante ipsum primis in faucibus. Curabitur eu
              lobortis est. Proin vitae ornare orci. Integer metus justo, porta
              eu blandit eu, vulputate eu odio. Nunc eu vehicula diam. Cras
              ornare, leo sed tincidunt mattis, nisi arcu varius lacus, sed
              consequat ligula sapien nec libero. Cras sit amet maximus ante.
              Donec in egestas est. Cras tortor magna, aliquam dapibus blandit
              quis, lacinia nec nisi. Vivamus libero eros, placerat eget diam
              ultricies, sagittis interdum lacus. Praesent sodales consequat
              mauris, non tempor augue tincidunt sed. Aenean eget iaculis elit.
              Fusce vestibulum accumsan leo, eu interdum nunc posuere mattis.
              Vivamus in augue eros. Sed sollicitudin diam ut ipsum luctus
              feugiat. In hendrerit libero at mollis imperdiet. Sed tortor orci,
              lobortis in mollis ac, mattis in felis. Vivamus finibus, enim quis
              venenatis imperdiet, mauris est ullamcorper nibh, id dictum augue
              mauris eget ipsum. Aliquam eu ornare enim, vulputate pretium est.
              Sed fermentum id ligula eget varius. Vestibulum scelerisque et
              diam eget tempus. Quisque sed ultricies libero. Aliquam vel risus
              at velit egestas vestibulum sed at turpis. Aliquam pretium elit et
              neque iaculis, a malesuada nisl viverra. Integer in metus diam.
              Quisque lacus purus, pulvinar ut porta placerat, vulputate eu
              massa. Suspendisse ac luctus felis, ac elementum nisl. Nullam
              varius, quam vel rhoncus lacinia, dolor tellus pretium ante, ut
              venenatis tellus risus in dui. Quisque in tellus sed quam
              tincidunt tristique non ut turpis. Donec mollis sem quis eleifend
              laoreet. Donec vitae accumsan arcu. Nunc blandit consequat eros at
              malesuada. Proin eleifend, diam nec fringilla commodo, libero
              tellus interdum tellus, ac hendrerit enim purus non justo. Nam vel
              massa aliquam, ultricies dolor et, eleifend sem. Lorem ipsum dolor
              sit amet, consectetur adipiscing elit. In nec congue velit.
              Curabitur bibendum dolor ut odio pellentesque, sit amet feugiat
              lacus mollis. Morbi non consectetur orci. Fusce at facilisis orci.
              Nam sed bibendum leo, lobortis vulputate nulla.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLegalDisplay(false)}>Close</Button>
          </DialogActions>
        </BootstrapDialog>
      </div>
      <s.NavItem>
        <s.NavLink onClick={() => setLegalDisplay(true)}>
          {t('Terms of Service')}
        </s.NavLink>
      </s.NavItem>
    </>
  );
};

export default LegalModal;
