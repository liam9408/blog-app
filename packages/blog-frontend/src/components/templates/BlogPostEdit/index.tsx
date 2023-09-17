/* eslint-disable react-hooks/exhaustive-deps */
import { useState, FC, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import { QuillEditor } from 'src/components/organisms/QuillEditor';
import { Post } from 'src/types/posts.type';
import { postApi } from 'src/api/posts-api';
import { categoriesApi } from 'src/api/category-api';
import { ImagePicker } from 'src/components/organisms/ImagePicker';
import { Category } from 'src/types/category.type';
import { useMounted } from 'src/hooks/use-mounted';

interface BlogPostEditProps {
  post?: Post;
  header?: string;
  type?: 'create' | 'edit';
  handleCancelEdit: () => void;
}

export const BlogPostEdit: FC<BlogPostEditProps> = (props) => {
  const { post, header, type = 'edit', handleCancelEdit } = props;

  const isMounted = useMounted();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [postContent, setPostContent] = useState(post?.content);
  const [openImagePicker, setOpenImagePicker] = useState(false);
  const [cover, setCover] = useState(post?.cover);
  const [categories, setCategories] = useState([]);

  const handleOpenImagePicker = () => {
    setOpenImagePicker(true);
  };

  const handleCloseImagePicker = () => {
    setOpenImagePicker(false);
  };

  const getCategories = useCallback(async () => {
    try {
      const resp = await categoriesApi.getCategories();
      if (resp.success) {
        setCategories(
          resp.data.map((category: Category) => ({
            id: category.id,
            name: category.name,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getCategories();
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .default(post?.title || '')
      .max(255)
      .required('Title must not be blank'),
    description: Yup.string()
      .default(post?.description || '')
      .required('Description must not be blank'),
    cover: Yup.string()
      .default(post?.cover || '')
      .required('You must select an image'),
    categoryId: Yup.number()
      .default(post?.categoryId || null)
      .required('Category cannot be blank'),
    content: Yup.string()
      .default(post?.content || '')
      .required('Content must not be blank'),
    status: Yup.string().default(post?.status || 'draft'),
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
  const categoryId = getValues('categoryId');

  const onSubmit = async (values: Post): Promise<void> => {
    try {
      setLoading(true);
      const newPostData = {
        title: values.title,
        description: values.description,
        cover: values.cover,
        status: values.status,
        categoryId: values.categoryId,
        content: postContent,
      };

      if (type === 'create') {
        const resp = await postApi.createPost(newPostData);
        if (resp.success) {
          router.push(`/post/${resp.data.id}`);
        }
      }
      if (type === 'edit') {
        const resp = await postApi.editPost(post.id, newPostData);
        if (resp.success) {
          window.location.reload();
        }
      }
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
            <Button
              onClick={handleCancelEdit}
              component="a"
              sx={{
                display: 'inline-flex',
                mr: 2,
              }}
              variant="text"
            >
              Cancel
            </Button>
          </div>
          <div>
            <LoadingButton
              loading={loading}
              type="submit"
              onClick={() => onSubmit({ ...getValues(), status: 'draft' })}
              sx={{
                display: 'inline-flex',
                mr: 2,
              }}
              variant="outlined"
            >
              Save
            </LoadingButton>
            {!post?.publishedAt && (
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
              <Box sx={{ mt: 3 }}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel id="demo-simple-select-label">
                    Category
                  </InputLabel>
                  <Select
                    {...register('categoryId')}
                    fullWidth
                    id="demo-simple-select"
                    labelId="demo-simple-select-label"
                    error={!!errors.categoryId}
                    label="Category"
                    name="categoryId"
                    defaultValue={categoryId}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.name} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
