import { Close } from '@mui/icons-material'
import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, TextField, Typography } from '@mui/material'
import * as R from 'ramda'
import React, { useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { BUCKET_NAME, Media } from 'src/@core/types'
import { Seat, Transportation } from 'src/@core/types/transport'
import { TripPayload, TripStatus } from 'src/@core/types/trip'
import { TransportationNormalForm, VanForm, getDefaultTransport } from './TransportationForm'

import { useRef } from 'react'

interface TripFormProps {
  trip_payload?: TripPayload
  onSubmit: SubmitHandler<any>
}

function TripForm(props: TripFormProps) {
  const p = props?.trip_payload

  const defaultValues = {
    title: p?.trip_data?.title || '',
    description: p?.trip_data.description || '',
    cover_images: p?.trip_data.cover_images || [],
    date_to_reserve: new Date(p?.trip_data.date_to_reserve || 0) || new Date(),
    from_date: new Date(p?.trip_data.from_date || 0) || new Date(),
    to_date: new Date(p?.trip_data.to_date || 0) || new Date(),
    payment: p?.trip_data.payment || null,
    total_people: p?.trip_data.total_people || 10,
    members: p?.trip_data.members || [],
    locations: p?.trip_data.locations || [],
    contacts: p?.trip_data.contacts || [],
    status: p?.trip_data.status || TripStatus.NotFull,
    transport_data: p?.transport_data || []
  }

  const rteRef = useRef<RichTextEditorRef>(null)
  const [selectedImages, setSelectedImages] = React.useState<Media[]>(defaultValues.cover_images)

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

  useEffect(() => {
    if (selectedImages.length >= 0) {
      setValue('cover_images', selectedImages)
    }
  }, [selectedImages.length])

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

  const {
    fields: transports,
    append: appendTransport,
    remove: removeTransport
  } = useFieldArray({
    control,
    name: 'transport_data'
  })

  return (
    <Card>
      <CardHeader title='สร้างทริป' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(props.onSubmit)}>
          <Grid container spacing={7}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. รายละเอียดทริป
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('title', { required: true })}
                label='หัวข้อ'
                variant='outlined'
                fullWidth
                error={!R.isNil(errors.title)}
                helperText={errors.title && errors.title?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('description', { required: true })}
                label='รายละเอียด'
                variant='outlined'
                fullWidth
                error={!R.isNil(errors.description)}
                helperText={errors.description && errors.description?.message}
                multiline
                minRows={6}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('total_people', { required: true })}
                label='จำนวนลูกทริป'
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
                    label='วิธีการติดต่อ'
                    defaultValue={item.contact_type}
                  />
                  <TextField
                    {...register(`contacts.${index}.link`)}
                    label='ลิงค์การติดต่อ'
                    defaultValue={item.link}
                    style={{ marginLeft: 10 }}
                  />
                  <IconButton
                    size='large'
                    aria-label='remove-destination'
                    onClick={() => removeContact(index)}
                    style={{ color: 'darkgrey' }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              ))}
              <Button type='button' variant='outlined' onClick={() => appendContact({ contact_type: '', link: '' })}>
                เพิ่มวิธีการติดต่อ
              </Button>
            </Grid>

            <Grid item xs={12}>
              {locationFields.map((item, index) => (
                <Box key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <TextField
                    {...register(`locations.${index}.title`)}
                    label='จุดหมายที่จะไป'
                    defaultValue={item.title}
                  />
                  <TextField
                    {...register(`locations.${index}.description`)}
                    label='ลิงค์ GPS หรือ แผนที่'
                    defaultValue={item.description}
                    style={{ marginLeft: 10 }}
                  />
                  <IconButton
                    size='large'
                    aria-label='remove-destination'
                    onClick={() => removeLocation(index)}
                    style={{ color: 'darkgrey' }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              ))}
              <Button type='button' variant='outlined' onClick={() => appendLocation({ title: '', description: '' })}>
                เพิ่มจุดหมาย
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
                อัพโหลดภาพเกี่ยวกับทริป
                <input
                  {...register('cover_images')}
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </Button>
              {errors.cover_images && <Typography color='error'>ต้องอัพโหลดอย่างน้อยหนึ่งภาพ</Typography>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                selected={watch('date_to_reserve', new Date())}
                showYearDropdown
                showMonthDropdown
                id='date_to_reserve_picker'
                placeholderText='MM-DD-YYYY'
                customInput={
                  <TextField label='วันเริ่มจอง' {...register('date_to_reserve', { required: true })} fullWidth />
                }
                onChange={(date: Date) => setValue('date_to_reserve', date)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                <DatePicker
                  selected={watch('from_date', new Date())}
                  showYearDropdown
                  showMonthDropdown
                  id='from_date_picker'
                  placeholderText='MM-DD-YYYY'
                  customInput={<TextField label='วันไป' {...register('from_date', { required: true })} fullWidth />}
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
                  customInput={<TextField label='วันกลับ' {...register('to_date', { required: true })} fullWidth />}
                  onChange={(date: Date) => setValue('to_date', date)}
                />
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                selected={watch('date_to_reserve', new Date())}
                showYearDropdown
                showMonthDropdown
                id='date_to_reserve_picker'
                placeholderText='MM-DD-YYYY'
                customInput={
                  <TextField label='วันเริ่มจอง' {...register('date_to_reserve', { required: true })} fullWidth />
                }
                onChange={(date: Date) => setValue('date_to_reserve', date)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. วิธีการรับเงิน
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('payment.full_price', { required: true })}
                label='ราคาเต็ม'
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
                label='ราคาจอง (จะมี หรือไม่มี ก็ได้)'
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
                      label='จ่ายภายในวัน'
                      {...register('payment.payment_date', { required: true })}
                      fullWidth
                    />
                  }
                  onChange={(date: Date) => setValue('payment.payment_date', date)}
                />
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                3. วิธีการเดินทาง
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box style={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                  variant='outlined'
                  style={{ marginRight: 20 }}
                  onClick={() => appendTransport(getDefaultTransport(10, 'VAN #1', Transportation.VAN))}
                >
                  เพิ่มรถตู้
                </Button>
                <Button
                  variant='outlined'
                  onClick={() => appendTransport(getDefaultTransport(5, 'SELF #1', Transportation.SELF))}
                >
                  เพิ่อวิธีการเดินทางแบบอื่่น
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              {transports.map((item, index) => (
                <Grid container spacing={7} key={index} style={{ marginBottom: 40 }}>
                  <Grid item xs={4}>
                    <TextField
                      {...register(`transport_data.${index}.name`)}
                      label='ชื่อ'
                      defaultValue={item.name}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      {...register(`transport_data.${index}.transport_by`)}
                      label='เดินทางด้วย'
                      disabled
                      fullWidth
                      defaultValue={item.transport_by}
                      style={{ marginLeft: 10 }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      {...register(`transport_data.${index}.total_seats`)}
                      label='จำนวนที่นั่ง'
                      disabled={item.transport_by === Transportation[Transportation.VAN]}
                      defaultValue={item.total_seats}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    {item.transport_by === Transportation[Transportation.VAN] ? (
                      <VanForm
                        values={watch(`transport_data.${index}.seats`)}
                        onChange={(data: Seat[]) => setValue(`transport_data.${index}.seats`, data)}
                      />
                    ) : (
                      <TransportationNormalForm />
                    )}
                  </Grid>
                  <Grid item xs={2}>
                    <Button type='button' variant='outlined' onClick={() => removeTransport(index)}>
                      ลบ
                    </Button>
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained' color='primary'>
                SAVE
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default TripForm
