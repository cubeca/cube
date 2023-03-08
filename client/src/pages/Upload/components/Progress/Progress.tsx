import { Box } from '@mui/material';
import * as s from './Progress.styled';

const Progress = ({ screens, screenIndex, onScreenIndexChange }: any) => {
  const nodes: any[] = [];

  screens.forEach((label: string, i: number) => {
    nodes.push(
      <ProgressItem
        screenIndex={i}
        onScreenIndexChange={onScreenIndexChange}
        active={screenIndex == i}
        label={label}
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
  active
}: any): any => {
  if (active) {
    return (
      <s.ProgressItem active>
        <ProgressItemButton
          screenIndex={screenIndex}
          onScreenIndexChange={onScreenIndexChange}
          label={label}
        />
      </s.ProgressItem>
    );
  } else {
    return (
      <s.ProgressItem>
        <ProgressItemButton
          screenIndex={screenIndex}
          onScreenIndexChange={onScreenIndexChange}
          label={label}
        />
      </s.ProgressItem>
    );
  }
};

const ProgressItemButton = ({
  screenIndex,
  onScreenIndexChange,
  label
}: any): any => {
  return (
    <button onClick={(e) => onScreenIndexChange(screenIndex)}>{label}</button>
  );
};

export default Progress;
