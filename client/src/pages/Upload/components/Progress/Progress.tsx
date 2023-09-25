import { Box } from '@mui/material';
import * as s from './Progress.styled';

const Progress = ({
  screens,
  screenIndex,
  onScreenIndexChange,
  isNextDisabled
}: any) => {
  const nodes: any[] = [];

  screens.forEach((label: string, i: number) => {
    nodes.push(
      <ProgressItem
        screenIndex={i}
        onScreenIndexChange={onScreenIndexChange}
        isActive={screenIndex == i}
        label={label}
        isDisabled={isNextDisabled}
      />
    );
  });

  return (
    <Box className={'upload__progress'}>
      <s.ProgressList>{nodes}</s.ProgressList>
    </Box>
  );
};

const ProgressItem = ({
  screenIndex,
  onScreenIndexChange,
  label,
  isActive,
  isDisabled
}: any): any => {
  const Button = (
    <ProgressItemButton
      screenIndex={screenIndex}
      onScreenIndexChange={onScreenIndexChange}
      label={label}
      isDisabled={isDisabled}
    />
  );

  if (isActive) {
    return <s.ProgressItem active>{Button}</s.ProgressItem>;
  } else {
    return <s.ProgressItem>{Button}</s.ProgressItem>;
  }
};

const ProgressItemButton = ({
  screenIndex,
  onScreenIndexChange,
  label,
  isDisabled
}: any): any => {
  return (
    <button
      onClick={(e) => onScreenIndexChange(screenIndex)}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
};

export default Progress;
