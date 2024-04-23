// ** React Imports
import { ChangeEvent, useState } from 'react'

// ** Next Import

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

  const handleLogoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const target: File = e.target.files[0]
      setSelectedFile(target)
      const logoMedia: Media = {
        bucket_name: BUCKET_NAME,
        name: target.name,
        uri: '',
        signed_url: '',
        type: target.type,
        file: target
      }
      setValue('logo_image', logoMedia)
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
                <Grid container spacing={4} key={item.id} sx={{ 
                    pb: 2, 
                    pt: 2,
                    borderBottom: 'solid 1px #ebebeb' 
                  }}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...register(`bank_accounts.${index}.bank_title`)}
                      label='ชื่อธนาคาร'
                      fullWidth
                      defaultValue={item.bank_title}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...register(`bank_accounts.${index}.account_name`)}
                      label='ชื่อบัญชี'
                      defaultValue={item.account_name}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={10} sm={3}>
                    <TextField
                      {...register(`bank_accounts.${index}.account_number`)}
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
                    {...register(`contacts.${index}.contact_type`)}
                    label='วิธีการติดต่อ'
                    defaultValue={item.contact_type}
                  />
                  <TextField
                    {...register(`contacts.${index}.link`)}
                    label='ลิงค์'
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
