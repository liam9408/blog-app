import { FC, forwardRef, ReactElement, Ref, useEffect, useState } from 'react';
import {
  Box,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  ImageList,
  ImageListItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import { CircularProgress } from '@mui/material';
import { Image } from 'src/types/image.type';
import { imagesApi } from 'src/api/image-api';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ImagePickerProps {
  open: boolean;
  handleClose: () => void;
  handleSelectImage: (image: string) => void;
}

interface ImageRowProps {
  image: Image;
  handleImageClick: (image: string) => void;
}

const ImageRow: FC<ImageRowProps> = (props) => {
  const { image, handleImageClick } = props;
  return (
    <ImageListItem>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        onClick={() => handleImageClick(image.image)}
        src={`${image.thumbnail}?w=248&fit=crop&auto=format`}
        srcSet={`${image.thumbnail}?w=248&fit=crop&auto=format&dpr=2 2x`}
        loading="lazy"
      ></img>
    </ImageListItem>
  );
};

export const ImagePicker: FC<ImagePickerProps> = (props) => {
  const { open, handleClose, handleSelectImage } = props;

  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const getImages = async () => {
    try {
      setLoadingImages(true);
      const resp = await imagesApi.getImages();
      if (resp.success) {
        setImages(resp.data);
        setLoadingImages(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Select Image
          </Typography>
        </Toolbar>
      </AppBar>

      {loadingImages && (
        <Box
          sx={{
            mt: 5,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {!loadingImages && (
        <Box sx={{ overflowY: 'scroll' }}>
          <ImageList variant="masonry" cols={5} gap={8}>
            {images.map((image: Image) => (
              <ImageRow
                handleImageClick={handleSelectImage}
                image={image}
                key={`${image.thumbnail}`}
              />
            ))}
          </ImageList>
        </Box>
      )}
    </Dialog>
  );
};
