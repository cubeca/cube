import { ContentQueryKeys } from 'api/enums';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const useFilterContent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const setFilter = (key: ContentQueryKeys, value: string) => {
    if (!value) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
    navigate(`${location.pathname}${searchParams ? `?${searchParams}` : ''}`);
  };

  return {
    setFilter
  };
};

export default useFilterContent;
