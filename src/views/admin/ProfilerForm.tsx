// ** React Imports
import { ChangeEvent, useState } from 'react'

// ** Next Import

// ** MUI Components
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Avatar, Typography, styled } from '@mui/material'
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

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

  return (
    <Card>
      <CardHeader title={props.title} titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(props.onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <label htmlFor='avatar-input'>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {selectedFile ? (
                    <ImgStyled src={URL.createObjectURL(selectedFile)} alt='Profile Pic' />
                  ) : !R.isNil(props?.profiler?.data?.logo_image?.signed_url) ? (
                    <ImgStyled src={props?.profiler?.data?.logo_image.signed_url} alt='Profile Pic' />
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
                      Upload Logo
                    </Button>
                    <ResetButtonStyled color='error' variant='outlined' onClick={() => setSelectedFile(null)}>
                      Reset
                    </ResetButtonStyled>
                    <Typography variant='body2' sx={{ marginTop: 5 }}>
                      Allowed PNG or JPEG. Max size of 800K.
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
                    label='Profiler name'
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
                    label='Description'
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
                <Box key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <TextField
                    {...register(`bank_accounts.${index}.bank_title`)}
                    label='Bank name'
                    defaultValue={item.bank_title}
                    style={{ marginLeft: 10 }}
                  />
                  <TextField
                    {...register(`bank_accounts.${index}.account_name`)}
                    label='Account name'
                    defaultValue={item.account_name}
                    style={{ marginLeft: 10 }}
                  />
                  <TextField
                    {...register(`bank_accounts.${index}.account_number`)}
                    label='Account number'
                    defaultValue={item.account_number}
                    style={{ marginLeft: 10 }}
                  />
                  <Button type='button' onClick={() => removeBankAccount(index)}>
                    Remove
                  </Button>
                </Box>
              ))}
              <Button
                type='button'
                onClick={() => appendBankAccount({ bank_title: '', account_name: '', account_number: '' })}
              >
                Add Bank Account
              </Button>
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
                  Save
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
