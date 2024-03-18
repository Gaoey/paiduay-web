import { Close } from '@mui/icons-material'
import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, TextField, Typography } from '@mui/material'
import * as R from 'ramda'
import React from 'react'
import DatePicker from 'react-datepicker'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { BUCKET_NAME, Media } from 'src/@core/types'
import { Trip, TripStatus } from 'src/@core/types/trip'

interface TripFormProps {
  trip_data?: Trip
  onSubmit: SubmitHandler<any>
}

function TripForm(props: TripFormProps) {
  const trip_data = props?.trip_data

  const defaultValues = {
    title: trip_data?.data?.title || '',
    description: trip_data?.data.description || '',
    cover_images: trip_data?.data.cover_images || [],
    date_to_reserve: trip_data?.data.date_to_reserve || new Date(),
    from_date: trip_data?.data.from_date || new Date(),
    to_date: trip_data?.data.to_date || new Date(),
    going_date: trip_data?.data.to_date || new Date(),
    payment: trip_data?.data.payment || null,
    total_people: trip_data?.data.total_people || 10,
    members: trip_data?.data.members || [],
    locations: trip_data?.data.locations || [],
    contacts: trip_data?.data.contacts || [],
    status: trip_data?.data.status || TripStatus.NotFull
  }

  const [selectedImages, setSelectedImages] = React.useState<Media[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const medias: Media[] = Array.from(files).map(file => {
        return {
          bucket_name: BUCKET_NAME,
          name: file.name,
          uri: URL.createObjectURL(file),
          signed_url: URL.createObjectURL(file),
          type: file.type,
          file: file
        }
      })
      setSelectedImages(prevMedias => [...prevMedias, ...medias])
    }
  }

  const removeImageByIndex = (index: number) => {
    if (index > -1) {
      const newSelectedImage = selectedImages
      newSelectedImage.splice(index, 1)
      setSelectedImages([...newSelectedImage])
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors }
  } = useForm({ defaultValues })

  const {
    fields: locationFields,
    append: appendLocation,
    remove: removeLocation
  } = useFieldArray({
    control,
    name: 'locations'
  })

  const {
    fields: contactsField,
    append: appendContact,
    remove: removeContact
  } = useFieldArray({
    control,
    name: 'contacts'
  })

  return (
    <Card>
      <CardHeader title='Create a Trip' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(props.onSubmit)}>
          <Grid container spacing={7}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Trip Details
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('title', { required: true })}
                label='Title'
                variant='outlined'
                fullWidth
                error={!R.isNil(errors.title)}
                helperText={errors.title && errors.title?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('description', { required: true })}
                label='Description'
                variant='outlined'
                fullWidth
                error={!R.isNil(errors.description)}
                helperText={errors.description && errors.description?.message}
                multiline
                rows={6}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('total_people', { required: true })}
                label='Total member'
                variant='outlined'
                type='number'
                fullWidth
                error={!R.isNil(errors.total_people)}
                helperText={errors.total_people && errors.total_people.message}
              />
            </Grid>

            <Grid item xs={12}>
              {contactsField.map((item, index) => (
                <Box key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <TextField
                    {...register(`contacts.${index}.contact_type`)}
                    label='Contact Platform'
                    defaultValue={item.contact_type}
                  />
                  <TextField
                    {...register(`contacts.${index}.link`)}
                    label='Link'
                    defaultValue={item.link}
                    style={{ marginLeft: 10 }}
                  />
                  <Button type='button' onClick={() => removeContact(index)}>
                    Remove
                  </Button>
                </Box>
              ))}
              <Button type='button' onClick={() => appendContact({ contact_type: '', link: '' })}>
                Add Contact
              </Button>
            </Grid>

            <Grid item xs={12}>
              {locationFields.map((item, index) => (
                <Box key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <TextField
                    {...register(`locations.${index}.title`)}
                    label='Location Title'
                    defaultValue={item.title}
                  />
                  <TextField
                    {...register(`locations.${index}.description`)}
                    label='Detail (optional)'
                    defaultValue={item.description}
                    style={{ marginLeft: 10 }}
                  />
                  <Button type='button' onClick={() => removeLocation(index)}>
                    Remove
                  </Button>
                </Box>
              ))}
              <Button type='button' onClick={() => appendLocation({ title: '', description: '' })}>
                Add Location
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Box mt={2} display='flex'>
                {selectedImages.map((image, index) => (
                  <Box key={index} style={{ position: 'relative', display: 'inline-block', marginRight: 10 }}>
                    <img src={image.signed_url} alt={`Image ${index}`} style={{ width: 100, height: 100 }} />
                    <IconButton
                      aria-label='remove-image'
                      onClick={() => removeImageByIndex(index)}
                      style={{ position: 'absolute', right: 0, top: 0, zIndex: 1, color: 'white' }}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              <Button variant='contained' component='label'>
                Upload Trip Images
                <input
                  {...register('cover_images')}
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </Button>
              {errors.cover_images && <Typography color='error'>Please select at least one image</Typography>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                selected={watch('date_to_reserve', new Date())}
                showYearDropdown
                showMonthDropdown
                id='date_to_reserve_picker'
                placeholderText='MM-DD-YYYY'
                customInput={
                  <TextField label='Date to reserve' {...register('date_to_reserve', { required: true })} fullWidth />
                }
                onChange={(date: Date) => setValue('date_to_reserve', date)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                <DatePicker
                  selected={watch('going_date', new Date())}
                  showYearDropdown
                  showMonthDropdown
                  id='going_date_picker'
                  placeholderText='MM-DD-YYYY'
                  customInput={
                    <TextField label='Going Date' {...register('going_date', { required: true })} fullWidth />
                  }
                  onChange={(date: Date) => setValue('going_date', date)}
                />
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                <DatePicker
                  selected={watch('from_date', new Date())}
                  showYearDropdown
                  showMonthDropdown
                  id='from_date_picker'
                  placeholderText='MM-DD-YYYY'
                  customInput={<TextField label='From Date' {...register('from_date', { required: true })} fullWidth />}
                  onChange={(date: Date) => setValue('from_date', date)}
                />
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                <DatePicker
                  selected={watch('to_date', new Date())}
                  showYearDropdown
                  showMonthDropdown
                  id='to_date_picker'
                  placeholderText='MM-DD-YYYY'
                  customInput={<TextField label='To Date' {...register('to_date', { required: true })} fullWidth />}
                  onChange={(date: Date) => setValue('to_date', date)}
                />
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. Payment
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('payment.full_price', { required: true })}
                label='Full price'
                variant='outlined'
                fullWidth
                type='number'
                error={!R.isNil(errors.payment?.full_price)}
                helperText={errors.payment?.full_price && errors.payment?.full_price.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('payment.deposit_price')}
                label='Reserve price (optional)'
                variant='outlined'
                fullWidth
                type='number'
                error={!R.isNil(errors.payment?.deposit_price)}
                helperText={errors.payment?.deposit_price && errors.payment.deposit_price.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                <DatePicker
                  selected={watch('payment.payment_date', new Date())}
                  showYearDropdown
                  showMonthDropdown
                  id='payment_date'
                  placeholderText='MM-DD-YYYY'
                  customInput={
                    <TextField
                      label='Payment date'
                      {...register('payment.payment_date', { required: true })}
                      fullWidth
                    />
                  }
                  onChange={(date: Date) => setValue('payment.payment_date', date)}
                />
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained' color='primary'>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default TripForm
