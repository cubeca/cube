import { useDocumentTitle } from 'hooks/useDocumentTitle';

const NotFound = () => {
  useDocumentTitle('Page Not Found');
  return <div>NotFound</div>;
};

export default NotFound;
