import { useState, FC } from 'react';
import NextLink from 'next/link';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';

import { QuillEditor } from 'src/components/organisms/QuillEditor';
import { Post } from 'src/types/posts.type';
import { postApi } from 'src/api/posts-api';
import { ImagePicker } from 'src/components/organisms/ImagePicker';

interface BlogPostEditProps {
  post: Post;
  header?: string;
}

export const BlogPostEdit: FC<BlogPostEditProps> = (props) => {
  const { post, header } = props;

  const [loading, setLoading] = useState(false);
  const [postContent, setPostContent] = useState(post.content);
  const [openImagePicker, setOpenImagePicker] = useState(false);
  const [cover, setCover] = useState(post.cover);

  const handleOpenImagePicker = () => {
    setOpenImagePicker(true);
  };

  const handleCloseImagePicker = () => {
    setOpenImagePicker(false);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .default(post.title || '')
      .max(255)
      .required('Title must not be blank'),
    description: Yup.string()
      .default(post.description || '')
      .required('Description must not be blank'),
    cover: Yup.string()
      .default(post.cover || '')
      .required('You must select an image'),
    content: Yup.string()
      .default(post.content || '')
      .required('Content must not be blank'),
    status: Yup.string().default(post.status || 'draft'),
  });

  const form = useForm({
    defaultValues: validationSchema.getDefault(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver<any>(validationSchema),
  });

  const { register, handleSubmit, getValues, formState, setValue, resetField } =
    form;
  const { errors } = formState;

  const coverVal = getValues('cover');

  const onSubmit = async (values: Post): Promise<void> => {
    try {
      setLoading(true);
      const newPostData = {
        title: values.title,
        description: values.description,
        cover: values.cover,
        status: values.status,
        content: postContent,
      };
      const resp = await postApi.editPost(post.id, newPostData);
      if (resp.success) {
        window.location.reload();
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleImageChange = (img: string) => {
    setCover(img);
    setValue('cover', img);
    handleCloseImagePicker();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h5" sx={{ mt: 2 }}>
          {header}
        </Typography>
        <Card
          elevation={14}
          sx={{
            backgroundColor: '#FFFFFF',
            mt: 4,
            width: '100%',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            px: 5,
            py: 3,
          }}
        >
          <div>
            <NextLink href="/posts" passHref>
              <Button
                component="a"
                sx={{
                  display: 'inline-flex',
                  mr: 2,
                }}
                variant="text"
              >
                Cancel
              </Button>
            </NextLink>
          </div>
          <div>
            <LoadingButton
              loading={loading}
              type="submit"
              sx={{
                display: 'inline-flex',
                mr: 2,
              }}
              variant="outlined"
            >
              Save
            </LoadingButton>
            {!post.publishedAt && (
              <LoadingButton
                loading={loading}
                onClick={() =>
                  onSubmit({ ...getValues(), status: 'published' })
                }
                sx={{
                  display: 'inline-flex',
                  mr: 2,
                }}
                variant="contained"
              >
                Publish
              </LoadingButton>
            )}
          </div>
        </Card>

        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6">Basic details</Typography>
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
                label="Post title"
                name="title"
                type="text"
              />
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  {...register('description')}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  label="Description"
                  name="description"
                  type="text"
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6">Post cover</Typography>
            {cover ? (
              <>
                <Box
                  sx={{
                    backgroundImage: `url(${coverVal})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    borderRadius: 1,
                    height: 230,
                    mt: 3,
                  }}
                />
                <Button
                  onClick={() => {
                    setCover(null);
                    resetField('cover');
                  }}
                  sx={{ mt: 3 }}
                  disabled={!coverVal}
                >
                  Remove photo
                </Button>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: 1,
                    borderRadius: 1,
                    borderStyle: 'dashed',
                    borderColor: 'divider',
                    height: 230,
                    mt: 3,
                    p: 3,
                    cursor: 'pointer',
                  }}
                  onClick={handleOpenImagePicker}
                >
                  <Typography align="center" color="textSecondary" variant="h6">
                    Select a cover image
                  </Typography>
                  <Typography
                    align="center"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                    variant="subtitle1"
                  >
                    Image used for the blog post cover and also for Open Graph
                    meta
                  </Typography>
                </Box>

                {/* <FormControl sx={{ width: '100%', maxWidth: '900px', mt: 2 }}>
                  <InputLabel id="demo-simple-select-label">
                    Select a cover image
                  </InputLabel>
                  <Select
                    id="demo-simple-select"
                    labelId="demo-simple-select-label"
                    label="Select a cover image"
                    sx={{ width: '100%' }}
                    onChange={handleImageChange}
                  >
                    <Box sx={{ height: 650, overflowY: 'scroll' }}>
                      <ImageList variant="masonry" cols={3} gap={8}>
                        {images.map((img: SelectProps) => (
                          <MenuItem key={img.key} value={img.val}>
                            <ImageRow image={img} />
                          </MenuItem>
                        ))}
                      </ImageList>
                    </Box>
                  </Select>
                </FormControl> */}
              </>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6">Content</Typography>
            <QuillEditor
              placeholder="Write something"
              value={postContent}
              onChange={setPostContent}
              sx={{
                height: 550,
                mt: 3,
              }}
            />
          </CardContent>
        </Card>
      </form>

      <ImagePicker
        open={openImagePicker}
        handleClose={handleCloseImagePicker}
        handleSelectImage={handleImageChange}
      />
    </>
  );
};
