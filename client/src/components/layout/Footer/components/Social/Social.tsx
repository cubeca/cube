import { Link } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

import * as s from './Social.styled';

const Social = () => (

  <s.SocialList component="ul">
    <s.SocialItem>
      <Link href="#"><TwitterIcon /></Link>
    </s.SocialItem>
    <s.SocialItem>
      <Link href="#"><InstagramIcon /></Link>
    </s.SocialItem>
  </s.SocialList>
);

export default Social;
