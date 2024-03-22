import { TextField, createFilterOptions } from '@mui/material';
import { FC, HTMLInputTypeAttribute, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { InputProps } from '../types';
import { Autocomplete } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useCollaborators from 'hooks/useCollaborators';

interface CollaboratorInputProps extends InputProps {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  variant?: 'standard' | 'outlined';
  rows?: string | number;
  multiline?: boolean;
  value?: any;
  editMode?: boolean;
  setFinalCollaborators?: any;
}

const CollaboratorInput: FC<CollaboratorInputProps> = ({
  label,
  name,
  control,
  defaultValue,
  rules = {},
  type = 'text',
  className = '',
  id = 'text-input',
  helperText = ' ',
  helperTextId,
  placeholder,
  fullWidth,
  sx,
  variant = 'outlined',
  rows,
  multiline,
  value,
  editMode,
  setFinalCollaborators
}) => {
  const { t } = useTranslation();

  const [allCollaborators, setAllCollaborators] = useState<string[]>([]);
  const [collaboratorMap, setCollaboratorMap] = useState<
    Record<string, string>
  >({});
  const [allCollaboratorIds, setAllCollaboratorIds] = useState(value || []);
  const [initialCollaboratorIds, setInitialCollaboratorIds] = useState([]);
  const [currentSelections, setCurrentSelections] = useState<any>([]);
  const [idToNameMap, setIdToNameMap] = useState<Record<string, string>>({});
  const [nameToIdMap, setNameToIdMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const { data: collaborators, isLoading: isCollaboratorsLoading } =
    useCollaborators();

  // convert ids to names for display
  useEffect(() => {
    if (collaborators) {
      const newAllCollaboratorIds = [...allCollaboratorIds];
      const newIdToNameMap: Record<string, string> = { ...idToNameMap };
      const newNameToIdMap: Record<string, string> = { ...nameToIdMap };
      const newAllCollaborators: string[] = allCollaborators.filter(
        (item, index, self) => self.indexOf(item) === index
      );
      for (const collaborator of collaborators) {
        newIdToNameMap[collaborator.id] = collaborator.organization;
        newNameToIdMap[collaborator.organization] = collaborator.id;
        if (!newAllCollaborators.includes(collaborator.organization)) {
          newAllCollaborators.push(collaborator.organization);
        }
      }

      setIdToNameMap(newIdToNameMap);
      setNameToIdMap((prevNameToIdMap) => ({
        ...prevNameToIdMap,
        ...newNameToIdMap
      }));
      setAllCollaborators(newAllCollaborators);

      // remove the first value because it's the profile owner's id
      // and doesn't need to be displayed or altered
      const valueIds = value
        ? value.slice(1).map((item: { organization: string | number }) => {
            return newNameToIdMap[item.organization];
          })
        : [];

      // If this collaborator is pre-selected and not already in allCollaboratorIds, add it
      for (const collaborator of collaborators) {
        if (
          valueIds.includes(collaborator.id) &&
          !newAllCollaboratorIds.includes(collaborator.id)
        ) {
          newAllCollaboratorIds.push(collaborator.id);
        }
      }

      if (editMode && value) {
        setAllCollaboratorIds(valueIds);
      }
    }
  }, [collaborators, editMode, value]);

  return (
    <>
      <Controller
        name="collaborators"
        control={control}
        rules={{ required: false }}
        key={allCollaboratorIds}
        render={({ field }) => (
          <Autocomplete
            {...field}
            multiple
            options={allCollaborators}
            getOptionLabel={(option) => option}
            key={allCollaboratorIds.join(',')}
            freeSolo={true}
            value={
              editMode
                ? allCollaboratorIds.map((id: string) => idToNameMap[id])
                : field.value
            }
            onChange={(event, newValue) => {
              const newIds = newValue.map((name) => nameToIdMap[name]);
              setAllCollaboratorIds(newIds);
              setFinalCollaborators(newIds);
              if (!editMode) {
                field.onChange(newValue);
              }
            }}
            isOptionEqualToValue={
              editMode
                ? undefined
                : (option, value) =>
                    option.toString().startsWith(value.toString())
            }
            filterOptions={createFilterOptions({
              ignoreCase: true,
              matchFrom: 'any'
            })}
            autoHighlight
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label=""
                placeholder="Collaborators"
              />
            )}
          />
        )}
      />
    </>
  );
};

export default CollaboratorInput;
