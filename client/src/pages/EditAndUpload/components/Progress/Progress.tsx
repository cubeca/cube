/**
 * `Progress` renders a progress indicator for the multi-screen upload/edit process.
 * It dynamically generates a list of progress items based on the `screens` prop, which represents the different steps in the process.
 * Each progress item is represented by a `ProgressItem` component, which is responsible for displaying the step label and indicating
 * the active step. The active step is highlighted, and navigation between steps is facilitated through the `onScreenIndexChange`
 * callback function. The `isNextDisabled` prop can be used to disable navigation if necessary.
 *
 * @param {string[]} screens An array of strings representing the labels for each step in the process.
 * @param {number} screenIndex The current active step index.
 * @param {(index: number) => void} onScreenIndexChange A callback function for changing the current step.
 * @param {boolean} isNextDisabled A boolean indicating if navigation to the next step should be disabled.
 */

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
