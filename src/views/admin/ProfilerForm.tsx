// ** React Imports
import { ChangeEvent, useState } from 'react'

// ** Next Import
import Pica from 'pica'

// ** MUI Components
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Avatar, Typography, styled, IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { Close } from '@mui/icons-material'

// ** Layout Import

// ** Demo Imports
import * as R from 'ramda'
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { BUCKET_NAME, Media } from 'src/@core/types'
import { Profiler } from 'src/@core/types/profiler'

export const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

interface ProfilerFormProps {
  title: string
  profiler?: Profiler
  onSubmit: SubmitHandler<any>
}

function ProfilerForm(props: ProfilerFormProps) {
  const defaultValues = {
    name: props?.profiler?.data?.name || '',
    description: props?.profiler?.data?.description || '',
    logo_image: props?.profiler?.data?.logo_image || null,
    cover_image: props?.profiler?.data?.cover_image || null,
    bank_accounts: props?.profiler?.data?.bank_accounts || [],
    contacts: props?.profiler?.data?.contacts || []
  }

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setValue
  } = useForm({
    defaultValues
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
    fields: bankAccountsField,
    append: appendBankAccount,
    remove: removeBankAccount
  } = useFieldArray({
    control,
    name: 'bank_accounts'
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const pica = Pica()

  const handleLogoFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file: File = e.target.files[0]

      // Validate file type
      if (!file.type.includes('jpeg') && !file.type.includes('png')) {
        alert('Only PNG and JPEG files are allowed.')

        return
      }

      if (file.size > 800 * 1024) {
        if (!window.confirm('File is larger than 800KB, it will be resized. Continue?')) {
          return
        }
        try {
          const img = new Image()
          img.src = URL.createObjectURL(file)

          // Wait for the image to load before resizing
          img.onload = async () => {
            const canvas = document.createElement('canvas')

            // Set canvas size proportionate to the image
            const scaleFactor = (800 * 1024) / file.size
            canvas.width = img.width * scaleFactor
            canvas.height = img.height * scaleFactor

            // Pica resize function
            await pica
              .resize(img, canvas)
              .then((result: any) => pica.toBlob(result, file.type, 0.9))
              .then((blob: any) => {
                const resizedFile = new File([blob], file.name, {
                  type: file.type
                })
                setSelectedFile(resizedFile)

                const logoMedia: Media = {
                  bucket_name: BUCKET_NAME,
                  name: resizedFile.name,
                  uri: '',
                  signed_url: '',
                  type: resizedFile.type,
                  file: resizedFile
                }
                setValue('logo_image', logoMedia)
              })
            URL.revokeObjectURL(img.src)
          }
          img.onerror = function () {
            console.error('The image could not be loaded.')
          }
        } catch (error) {
          console.error('Error resizing image:', error)
          alert('Failed to resize image.')
        }
      } else {
        setSelectedFile(file)
        const logoMedia: Media = {
          bucket_name: BUCKET_NAME,
          name: file.name,
          uri: '',
          signed_url: '',
          type: file.type,
          file: file
        }
        setValue('logo_image', logoMedia)
      }
    }
  }

  const imageURL = props?.profiler?.data?.logo_image?.signed_url || '/images/logo-square.png'

  return (
    <Card sx={{ maxWidth: 1200 }}>
      <CardHeader title={props.title} />
      <CardContent>
        <form onSubmit={handleSubmit(props.onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <label htmlFor='avatar-input'>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {selectedFile ? (
                    <ImgStyled src={URL.createObjectURL(selectedFile)} alt='Profile Pic' />
                  ) : !R.isNil(props?.profiler?.data?.logo_image?.signed_url) ? (
                    <ImgStyled src={imageURL} alt='Profile Pic' />
                  ) : (
                    <Avatar sx={{ width: 100, height: 100, marginRight: 10 }}>
                      <CloudUploadIcon />
                    </Avatar>
                  )}
                  <Box>
                    <input
                      id='avatar-input'
                      type='file'
                      accept='image/*'
                      style={{ display: 'none' }}
                      {...register('logo_image')}
                      onChange={e => handleLogoFileChange(e)}
                    />
                    <Button variant='contained' component='span' startIcon={<CloudUploadIcon />}>
                      อัพโหลด logo
                    </Button>
                    <ResetButtonStyled color='error' variant='outlined' onClick={() => setSelectedFile(null)}>
                      เริ่มใหม่
                    </ResetButtonStyled>
                    <Typography variant='body2' sx={{ marginTop: 5 }}>
                      ใส่ได้แค่ไฟล์ PNG หรือ JPEG. ไซส์ห้ามเกิน 800K.
                    </Typography>
                  </Box>
                </Box>
              </label>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='name'
                control={control}
                rules={{
                  maxLength: {
                    value: 100,
                    message: 'max length 100 characters'
                  },
                  required: {
                    value: true,
                    message: 'name is required'
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    fullWidth
                    label='ชื่อ'
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    error={!R.isNil(errors.name)}
                    helperText={errors.name && errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='description'
                control={control}
                rules={{
                  maxLength: {
                    value: 1000,
                    message: 'max length 1000 characters'
                  },
                  required: {
                    value: true,
                    message: 'name is required'
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label='คำแนะนำตัวเอง'
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    error={!R.isNil(errors.description)}
                    helperText={errors.description && errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              {bankAccountsField.map((item, index) => (
                <Grid
                  container
                  spacing={4}
                  key={item.id}
                  sx={{
                    pb: 2,
                    pt: 2,
                    borderBottom: 'solid 1px #ebebeb'
                  }}
                >
                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...register(`bank_accounts.${index}.bank_title`, { required: 'ต้องมีชื่อธนาคาร' })}
                      label='ชื่อธนาคาร'
                      fullWidth
                      defaultValue={item.bank_title}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...register(`bank_accounts.${index}.account_name`, { required: 'ต้องมีชื่อบัญชี' })}
                      label='ชื่อบัญชี'
                      defaultValue={item.account_name}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={10} sm={3}>
                    <TextField
                      {...register(`bank_accounts.${index}.account_number`, { required: 'ต้องมีเลขบัญชี' })}
                      label='เลขบัญชี'
                      defaultValue={item.account_number}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={2} sm={1}>
                    <IconButton
                      size='large'
                      aria-label='remove-bank-account'
                      onClick={() => removeBankAccount(index)}
                      style={{ color: 'darkgrey' }}
                    >
                      <Close />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                type='button'
                variant='outlined'
                style={{ marginTop: '1em' }}
                onClick={() => appendBankAccount({ bank_title: '', account_name: '', account_number: '' })}
              >
                เพิ่มบัญชีธนาคาร
              </Button>
            </Grid>

            <Grid item xs={12}>
              {contactsField.map((item, index) => (
                <Box key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <TextField
                    {...register(`contacts.${index}.contact_type`, { required: 'ต้องมีวิธีการติดต่อ' })}
                    label='วิธีการติดต่อ'
                    defaultValue={item.contact_type}
                  />
                  <TextField
                    {...register(`contacts.${index}.link`, { required: 'โปรดใส่ข้อมูลในการติดต่อ' })}
                    label='ลิงค์ หรือ เบอร์โทร id'
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
              <Box
                sx={{
                  gap: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Button type='submit' variant='contained' size='large'>
                  บันทึก
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ProfilerForm
