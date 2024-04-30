import { Close } from '@mui/icons-material'
import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, TextField, Typography } from '@mui/material'
import * as R from 'ramda'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { BUCKET_NAME, Media } from 'src/@core/types'
import { Seat, Transportation } from 'src/@core/types/transport'
import { TripPayload, TripStatus } from 'src/@core/types/trip'
import { TransportationNormalForm, VanForm, getDefaultTransport } from './TransportationForm'

import Tiptap from '../editor/Tiptap'
import 'react-datepicker/dist/react-datepicker.css'
import Pica from 'pica'
import { format, parseISO } from 'date-fns'

interface TripFormProps {
  trip_payload?: TripPayload
  onSubmit: SubmitHandler<any>
  isHiddenTransport?: boolean
}

function TripForm(props: TripFormProps) {
  const { isHiddenTransport = false } = props
  const p = props?.trip_payload

  const defaultValues = {
    title: p?.trip_data?.title || '',
    description: p?.trip_data.description || '',
    cover_images: p?.trip_data.cover_images || [],
    date_to_reserve: new Date(p?.trip_data.date_to_reserve || new Date()),
    from_date: new Date(p?.trip_data.from_date || new Date()),
    to_date: new Date(p?.trip_data.to_date || new Date()),
    payment:
      {
        ...p?.trip_data.payment,
        payment_date: new Date(p?.trip_data.payment?.payment_date || new Date())
      } || null,
    total_people: p?.trip_data.total_people || 10,
    members: p?.trip_data.members || [],
    locations: p?.trip_data.locations || [],
    contacts: p?.trip_data.contacts || [],
    status: p?.trip_data.status || TripStatus.NotFull,
    transport_data: p?.transport_data || []
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    setError,
    clearErrors
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

  // IMAGE HANDLING LOGIC
  const [selectedImages, setSelectedImages] = React.useState<Media[]>(defaultValues.cover_images)

  const handleImageChange = async (e: any) => {
    const files = e.target.files
    if (files) {
      const filteredFiles = Array.from(files).filter(
        (file: any) => file.type === 'image/jpeg' || file.type === 'image/png'
      )

      const resizedImages = await Promise.all(
        filteredFiles.map(async (file: any) => {
          if (file.size > 6000 * 1024) {
            const img = new Image()
            const canvas = document.createElement('canvas')
            const pica = Pica()

            return new Promise((resolve, reject) => {
              img.onload = () => {
                const scaleFactor = Math.sqrt((6000 * 1024) / file.size) // Scale factor for resizing
                canvas.width = img.width * scaleFactor
                canvas.height = img.height * scaleFactor

                pica
                  .resize(img, canvas)
                  .then((resizedCanvas: any) => pica.toBlob(resizedCanvas, file.type, 0.9))
                  .then((blob: any) => {
                    const resizedFile = new File([blob], file.name, { type: file.type })
                    resolve({
                      bucket_name: BUCKET_NAME,
                      name: file.name,
                      uri: URL.createObjectURL(resizedFile),
                      signed_url: URL.createObjectURL(resizedFile),
                      type: file.type,
                      file: resizedFile
                    })
                  })
              }
              img.onerror = reject
              img.src = URL.createObjectURL(file)
            })
          } else {
            return {
              bucket_name: BUCKET_NAME,
              name: file.name,
              uri: URL.createObjectURL(file),
              signed_url: URL.createObjectURL(file),
              type: file.type,
              file: file
            }
          }
        })
      )

      setSelectedImages((prevImages: any) => [...prevImages, ...resizedImages])
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

  // RICH TEXT HANDLING LOGIC
  const [tiptapContent, setTiptapContent] = useState('')

  const handleTiptapChange = (content: React.SetStateAction<string>) => {
    setTiptapContent(content)
  }

  const handleSubmitWithTiptap = handleSubmit(data => {
    // Date validations
    const fromDate = new Date(data.from_date)
    const toDate = new Date(data.to_date)
    const reserveDate = new Date(data.date_to_reserve)
    const paymentDate = new Date(data.payment.payment_date)

    let hasError = false

    if (fromDate >= toDate) {
      setError('from_date', { type: 'custom', message: 'วันไป ต้องมาก่อน วันกลับ' })
      setError('to_date', { type: 'custom', message: 'วันกลับ ต้องมาหลัง วันไป' })
      hasError = true
    }

    if (reserveDate >= fromDate) {
      setError('date_to_reserve', { type: 'custom', message: 'วันเริ่มจอง ต้องมาก่อนกว่า วันไป' })
      hasError = true
    }

    if (paymentDate >= fromDate || paymentDate >= toDate || paymentDate <= reserveDate) {
      setError('payment.payment_date', {
        type: 'custom',
        message: 'วันที่ลูกค้าต้องชำระเงิน ต้องเป็นวันก่อนวันไป และหลังจากวันให้เริ่มจอง'
      })
      hasError = true
    }

    if (hasError) {
      alert('โปรดใส่ข้อมูลวันที่ต่างๆ ให้ถูกต้อง')

      return
    }

    // Add rich text description content
    data.description = tiptapContent

    // Validate 
    if (data.cover_images.length === 0) {
      alert('ต้องอัพโหลดอย่างน้อยหนึ่งภาพ')

      return
    }
    props.onSubmit(data)
  })

  // TRANSPORT HANDLING LOGIC
  const {
    fields: transports,
    append: appendTransport,
    remove: removeTransport
  } = useFieldArray({
    control,
    name: 'transport_data'
  })

  const numberOfVans = transports.reduce(
    (total, x) => total + (x.transport_by === Transportation[Transportation.VAN] ? 1 : 0),
    0
  )
  const numberOfAlternativeVehicles = transports.length - numberOfVans

  // RENDER COMPONENT
  return (
    <Card>
      <CardHeader title='สร้างทริป' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmitWithTiptap}>
          <Grid container spacing={7}>
            <Grid item xs={12}>
              <TextField
                {...register('title', { required: 'โปรดใส่หัวข้อ' })}
                label='หัวข้อ'
                variant='outlined'
                fullWidth
                error={!R.isNil(errors.title)}
                helperText={errors.title && errors.title?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600, paddingBottom: '2em' }}>
                รายละเอียด
              </Typography>
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '1em',
                  boxShadow: 'inset 3px 3px 3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Tiptap defaultValue={p?.trip_data.description || ''} onChange={handleTiptapChange} />
              </div>
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('total_people', { required: 'โปรดใส่จำนวนลูกทริป' })}
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
                    {...register(`contacts.${index}.contact_type`, { required: 'Contact type is required' })}
                    label='วิธีการติดต่อ'
                    defaultValue={item.contact_type}
                  />
                  <TextField
                    {...register(`contacts.${index}.link`, { required: 'Contact link is required' })}
                    label='ลิงค์การติดต่อ'
                    defaultValue={item.link}
                    style={{ marginLeft: 10 }}
                  />
                  <IconButton
                    size='large'
                    aria-label='remove-contact'
                    onClick={() => removeContact(index)}
                    style={{ color: 'darkgrey' }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              ))}
              <Button
                type='button'
                variant='outlined'
                onClick={() => {
                  appendContact({ contact_type: '', link: '' })
                }}
              >
                เพิ่มวิธีการติดต่อ
              </Button>
            </Grid>

            <Grid item xs={12}>
              {locationFields.map((item, index) => (
                <Box key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <TextField
                    {...register(`locations.${index}.title`, { required: 'โปรดใส่ชื่อจุหมาย' })}
                    label='จุดหมายที่จะไป'
                    defaultValue={item.title}
                  />
                  <TextField
                    {...register(`locations.${index}.description`, { required: 'Location description is required' })}
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
                อัพโหลดภาพประกอบ
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
              <DatePickerWrapper>
                <DatePicker
                  selected={watch('from_date', new Date()) || defaultValues.from_date}
                  showYearDropdown
                  showMonthDropdown
                  id='from_date_picker'
                  placeholderText='MM/DD/YYYY'
                  customInput={
                    <TextField label='วันไป' {...register('from_date', { required: 'โปรดใส่วันไป' })} fullWidth />
                  }
                  onChange={(date: Date) => setValue('from_date', date)}
                  minDate={new Date()}
                />
                {errors.from_date && <Typography color='error'>{errors.from_date.message}</Typography>}
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                <DatePicker
                  selected={watch('to_date', new Date()) || defaultValues.to_date}
                  showYearDropdown
                  showMonthDropdown
                  id='to_date_picker'
                  placeholderText='MM/DD/YYYY'
                  customInput={
                    <TextField label='วันกลับ' {...register('to_date', { required: 'โปรดใส่วันกลับ' })} fullWidth />
                  }
                  onChange={(date: Date) => setValue('to_date', date)}
                  minDate={new Date()}
                />
                {errors.to_date && <Typography color='error'>{errors.to_date.message}</Typography>}
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePickerWrapper>
                <DatePicker
                  selected={watch('date_to_reserve', new Date()) || defaultValues.date_to_reserve}
                  showYearDropdown
                  showMonthDropdown
                  id='date_to_reserve_picker'
                  placeholderText='MM/DD/YYYY'
                  customInput={
                    <TextField
                      label='วันเริ่มจอง'
                      {...register('date_to_reserve', { required: 'โปรดใส่วันเริ่มจอง' })}
                      fullWidth
                    />
                  }
                  onChange={(date: Date) => setValue('date_to_reserve', date)}
                  minDate={new Date()}
                />
                {errors.date_to_reserve && <Typography color='error'>{errors.date_to_reserve.message}</Typography>}
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                วิธีการรับเงิน
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('payment.full_price', { required: 'โปรดใส่ราคาทริป' })}
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
                  selected={watch('payment.payment_date', new Date()) || defaultValues.payment.payment_date}
                  showYearDropdown
                  showMonthDropdown
                  id='payment_date'
                  placeholderText='MM/DD/YYYY'
                  customInput={
                    <TextField
                      label='จ่ายภายในวัน'
                      {...register('payment.payment_date', { required: 'โปรดใส่วันสุดท้ายที่รับชำระเงิน' })}
                      fullWidth
                    />
                  }
                  onChange={(date: Date) => setValue('payment.payment_date', date)}
                />
                {errors?.payment?.payment_date && (
                  <Typography color='error'>{errors.payment.payment_date.message}</Typography>
                )}
              </DatePickerWrapper>
            </Grid>

            {!isHiddenTransport && (
              <>
                <Grid item xs={12}>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    วิธีการเดินทาง
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box style={{ display: 'flex', flexDirection: 'row' }}>
                    <Button
                      variant='outlined'
                      style={{ marginRight: '1em' }}
                      onClick={() =>
                        appendTransport(getDefaultTransport(10, `VAN #${numberOfVans + 1}`, Transportation.VAN))
                      }
                    >
                      เพิ่มรถตู้
                    </Button>
                    <Button
                      variant='outlined'
                      onClick={() =>
                        appendTransport(
                          getDefaultTransport(5, `OTHER #${numberOfAlternativeVehicles + 1}`, Transportation.SELF)
                        )
                      }
                    >
                      เพิ่อวิธีการเดินทางแบบอื่น
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
                          <TransportationNormalForm
                            values={watch(`transport_data.${index}.seats`)}
                            totalSeats={watch(`transport_data.${index}.total_seats`)}
                            onChange={(data: Seat[]) => setValue(`transport_data.${index}.seats`, data)}
                          />
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
              </>
            )}

            <Grid item xs={12}>
              <Button type='submit' variant='contained' color='primary'>
                บันทึก
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default TripForm
