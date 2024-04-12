import React from 'react'
import { SubmitHandler } from 'react-hook-form'
import { Booking } from 'src/@core/types/booking'

interface BookingFormProps {
  booking_data?: Booking
  onSubmit: SubmitHandler<any>
}

export default function BookingForm(props: BookingFormProps) {
  const { booking_data: p } = props
  const defaultValues = {}

  return <div>BookingForm</div>
}
