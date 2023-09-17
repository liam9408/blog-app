import { useRef, useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import {
  Autocomplete,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material';
import { Search as SearchIcon } from 'src/icons/search';
import { ContentSearchDialog } from './content-search-dialogue';
import useClickOutside from 'src/hooks/use-click-outside';
import { wait } from 'src/utils/wait';
import { postApi } from 'src/api/posts-api';

export const ContentSearchButton = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState([]);
  const [searchParam, setSearchParam] = useState('');
  const [showResults, setShowResults] = useState(false);

  const modalRef = useRef();

  useClickOutside(modalRef, () => {
    if (open) setOpenDialog(false);
  });

  const handleCloseSearchDialog = (): void => {
    setOpenDialog(false);
    setShowResults(false);
    setResults([]);
  };

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    setOpenDialog(true);
    setSearchParam(e.target.value);
  };

  const handleFocusSearch = () => {
    setOpenDialog(true);
  };

  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    const query = {
      title: searchParam,
      limit: 10,
      offset: 0,
    };
    // Do search here
    const resp = await postApi.getPosts(query);
    await wait(1500);
    if (resp.success) {
      setResults(resp.data.rows);
      setLoading(false);
      setShowResults(true);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Tooltip title="Search">
        <form onSubmit={handleSubmit} onClick={handleFocusSearch}>
          <Autocomplete
            sx={{ minWidth: '50vw' }}
            options={[]}
            renderInput={(params) => (
              <TextField
                {...params}
                onClick={handleFocusSearch}
                onChange={handleChangeSearch}
                size="small"
                placeholder="Search articles"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        sx={{
                          ml: -1,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <SearchIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </form>
      </Tooltip>
      <ContentSearchDialog
        modalRef={modalRef}
        onClose={handleCloseSearchDialog}
        open={openDialog}
        loading={loading}
        results={results}
        showResults={showResults}
      />
    </Box>
  );
};
